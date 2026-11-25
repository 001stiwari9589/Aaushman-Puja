import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '001stiwari9589@gmail.com';
const COOKIE_NAME = 'vedic_admin_token';

if (!JWT_SECRET || !ADMIN_USER || !ADMIN_PASS_HASH) {
  console.warn('⚠️ SECURITY WARNING: JWT_SECRET, ADMIN_USER, or ADMIN_PASS_HASH missing in .env. Admin login is disabled.');
}

// Helmet security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
}));

// Strict CORS restricted to configured production domain(s) + dev localhost
const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = IS_PROD
  ? configuredOrigins
  : [...new Set([...configuredOrigins, 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'])];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));

// Express Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please wait 15 minutes before trying again.' },
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions from this IP. Please try again shortly.' },
});

// Zod Schemas for all POST bodies
const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(100),
  password: z.string().min(1, 'Password is required').max(200),
});

const indianMobileSchema = z.string().trim().refine((val) => {
  const digits = val.replace(/\D/g, '');
  const normalized = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(normalized);
}, 'Please provide a valid 10-digit Indian mobile number.');

const nameRegex = /^[a-zA-Z\s.\u0900-\u097F]{2,120}$/;

const bookingSchemaZod = z.object({
  fullName: z.string().trim().regex(nameRegex, 'Please provide a valid full name (letters only, min 2 characters).'),
  mobile: indianMobileSchema,
  email: z.string().trim().email('Please provide a valid email address.').max(150).optional().or(z.literal('')).default(''),
  puja: z.string().trim().min(2, 'Please select a Puja ceremony.').max(120),
  preferredDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date.').optional().or(z.literal('')).default(''),
  preferredTime: z.string().trim().max(80).optional().default('Morning (06:00 AM - 09:00 AM)'),
  city: z.string().trim().min(2, 'Please enter your city and location.').max(200),
  language: z.string().trim().max(60).optional().default('English & Hindi'),
  gotra: z.string().trim().max(80).optional().default(''),
  additionalRequirements: z.string().trim().max(1000).optional().default(''),
});

const contactSchemaZod = z.object({
  name: z.string().trim().regex(nameRegex, 'Please provide a valid name (letters only).'),
  phone: indianMobileSchema,
  email: z.string().trim().email('Please provide a valid email address.').max(150),
  message: z.string().trim().min(10, 'Please enter a message of at least 10 characters.').max(1500),
});

const brahminSchemaZod = z.object({
  fullName: z.string().trim().regex(nameRegex, 'Please provide a valid full name (letters only).'),
  mobile: indianMobileSchema,
  email: z.string().trim().email('Please provide a valid email address.').max(150),
  city: z.string().trim().min(2, 'Please enter your city/state.').max(150),
  experience: z.string().trim().max(50).optional().default('5-10 Years'),
  qualification: z.string().trim().min(3, 'Please enter your Vedic qualification.').max(200),
  languages: z.string().trim().max(120).optional().default('Hindi & Sanskrit'),
  gotra: z.string().trim().max(80).optional().default(''),
});

const reviewSchemaZod = z.object({
  name: z.string().trim().regex(nameRegex, 'Please provide a valid name (letters only).'),
  location: z.string().trim().min(2, 'Please enter your city.').max(80),
  puja: z.string().trim().min(2, 'Please enter the Puja name.').max(100),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  comment: z.string().trim().min(10, 'Review must be at least 10 characters.').max(600),
});

// HTML Escaping Helper for Email Templates
const escapeHtml = (value) => {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const safeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
};

// Persistent local JSON fallback store (starts clean with NO sample/dummy data)
const DATA_FILE = path.join(__dirname, 'bookings_data.json');
let localStore = { bookings: [], brahmins: [], reviews: [] };

if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    localStore = {
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
      brahmins: Array.isArray(parsed.brahmins) ? parsed.brahmins : [],
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
    };
  } catch {
    console.warn('Failed to parse local data file, starting with clean store.');
  }
}

const saveLocalStore = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local store:', err.message);
  }
};

// MongoDB Connection
let isMongoConnected = false;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vedic_puja';

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
  })
  .catch(() => {
    console.log('ℹ️ MongoDB not detected locally. Running with local JSON storage.');
  });

// Mongoose Schemas
const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, default: '' },
  puja: { type: String, required: true },
  preferredDate: { type: String, default: '' },
  preferredTime: { type: String, default: 'Morning (06:00 AM - 09:00 AM)' },
  city: { type: String, required: true },
  language: { type: String, default: 'English & Hindi' },
  gotra: { type: String, default: '' },
  additionalRequirements: { type: String, default: '' },
  status: { type: String, default: 'New', enum: ['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now },
});
const BookingModel = mongoose.model('Booking', bookingSchema);

const brahminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  experience: { type: String, required: true },
  qualification: { type: String, required: true },
  languages: { type: String, required: true },
  gotra: { type: String, default: '' },
  status: { type: String, default: 'Pending Verification' },
  createdAt: { type: Date, default: Date.now },
});
const BrahminModel = mongoose.model('Brahmin', brahminSchema);

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  puja: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});
const ReviewModel = mongoose.model('Review', reviewSchema);

// Nodemailer Transporter (Gmail requires a 16-char App Password)
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: { user: smtpUser, pass: smtpPass },
    });
  }
  return nodemailer.createTransport({ jsonTransport: true });
};

const sendBookingNotification = async (booking) => {
  try {
    const transporter = createTransporter();
    const cleanPhone = booking.mobile ? booking.mobile.replace(/[^0-9]/g, '') : '';
    const htmlContent = `
      <div style="font-family:Poppins,Arial,sans-serif;background:#FFF8EC;padding:24px;color:#4A1C0C;">
        <div style="max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #EBD5B0;border-radius:12px;padding:28px;">
          <h2 style="margin:0 0 8px;color:#4A1C0C;">Divine Vedic Puja — New Booking</h2>
          <p style="margin:0 0 18px;color:#5D4037;font-size:14px;">Reference ID: <strong>#${escapeHtml(booking._id)}</strong></p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;color:#8D6E63;width:38%;">Puja:</td><td style="padding:8px 0;font-weight:700;color:#E65100;">${escapeHtml(booking.puja)}</td></tr>
            <tr><td style="padding:8px 0;color:#8D6E63;">Devotee Name:</td><td style="padding:8px 0;">${escapeHtml(booking.fullName)}</td></tr>
            <tr><td style="padding:8px 0;color:#8D6E63;">Mobile:</td><td style="padding:8px 0;">${escapeHtml(booking.mobile)}</td></tr>
            <tr><td style="padding:8px 0;color:#8D6E63;">Email:</td><td style="padding:8px 0;">${escapeHtml(booking.email)}</td></tr>
            <tr><td style="padding:8px 0;color:#8D6E63;">Preferred Date:</td><td style="padding:8px 0;font-weight:700;">${escapeHtml(booking.preferredDate)}</td></tr>
            <tr><td style="padding:8px 0;color:#8D6E63;">Time Slot:</td><td style="padding:8px 0;">${escapeHtml(booking.preferredTime)}</td></tr>
            <tr><td style="padding:8px 0;color:#8D6E63;">City & Address:</td><td style="padding:8px 0;">${escapeHtml(booking.city)}</td></tr>
            <tr><td style="padding:8px 0;color:#8D6E63;">Language:</td><td style="padding:8px 0;">${escapeHtml(booking.language)}</td></tr>
            ${booking.gotra ? `<tr><td style="padding:8px 0;color:#8D6E63;">Gotra:</td><td style="padding:8px 0;">${escapeHtml(booking.gotra)}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#8D6E63;">Instructions:</td><td style="padding:8px 0;">${escapeHtml(booking.additionalRequirements || 'Standard Vedic Vidhi')}</td></tr>
          </table>
          <div style="margin-top:20px;">
            <a href="tel:${cleanPhone}" style="display:inline-block;background:#E65100;color:#FFFFFF;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;margin-right:8px;">Call Devotee</a>
            ${cleanPhone ? `<a href="https://wa.me/91${cleanPhone.slice(-10)}" style="display:inline-block;background:#25D366;color:#FFFFFF;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;">WhatsApp</a>` : ''}
          </div>
        </div>
      </div>`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Divine Vedic Puja Sansthan" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      ...(booking.email ? { cc: booking.email } : {}),
      subject: `[Divine Vedic Puja] New Booking: ${booking.puja} - ${booking.fullName}`,
      html: htmlContent,
    });
  } catch (err) {
    console.error('Booking email error:', err.message);
  }
};

const sendContactNotification = async ({ name, email, phone, message }) => {
  try {
    const transporter = createTransporter();
    const htmlContent = `
      <div style="font-family:Poppins,Arial,sans-serif;background:#FFF8EC;padding:24px;color:#4A1C0C;">
        <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #EBD5B0;border-radius:12px;padding:28px;">
          <h2 style="margin:0 0 12px;color:#4A1C0C;">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong><br/>${escapeHtml(message)}</p>
        </div>
      </div>`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Divine Vedic Puja Sansthan" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `[Divine Vedic Puja] Contact Inquiry from ${name}`,
      html: htmlContent,
    });
  } catch (err) {
    console.error('Contact email error:', err.message);
  }
};

const sendBrahminNotification = async (brahmin) => {
  try {
    const transporter = createTransporter();
    const htmlContent = `
      <div style="font-family:Poppins,Arial,sans-serif;background:#FFF8EC;padding:24px;color:#4A1C0C;">
        <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #EBD5B0;border-radius:12px;padding:28px;">
          <h2 style="margin:0 0 12px;color:#4A1C0C;">New Brahmin / Pandit Registration</h2>
          <p><strong>Name:</strong> ${escapeHtml(brahmin.fullName)}</p>
          <p><strong>Mobile:</strong> ${escapeHtml(brahmin.mobile)}</p>
          <p><strong>Email:</strong> ${escapeHtml(brahmin.email)}</p>
          <p><strong>City:</strong> ${escapeHtml(brahmin.city)}</p>
          <p><strong>Experience:</strong> ${escapeHtml(brahmin.experience)}</p>
          <p><strong>Qualification:</strong> ${escapeHtml(brahmin.qualification)}</p>
          <p><strong>Languages:</strong> ${escapeHtml(brahmin.languages)}</p>
          ${brahmin.gotra ? `<p><strong>Gotra:</strong> ${escapeHtml(brahmin.gotra)}</p>` : ''}
        </div>
      </div>`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Divine Vedic Puja Sansthan" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: brahmin.email,
      subject: `[Divine Vedic Puja] New Brahmin Registration: ${brahmin.fullName}`,
      html: htmlContent,
    });
  } catch (err) {
    console.error('Brahmin email error:', err.message);
  }
};

// Admin Authentication Middleware (reads httpOnly cookie or Authorization Bearer fallback)
const verifyAdminToken = (req, res, next) => {
  if (!JWT_SECRET) {
    return res.status(503).json({ success: false, message: 'Server authentication not configured.' });
  }
  const cookieToken = req.cookies?.[COOKIE_NAME];
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
    }
    req.admin = decoded;
    return next();
  } catch {
    return res.status(403).json({ success: false, message: 'Invalid or expired session.' });
  }
};

// ================= ROUTES ================= //

// Admin Login (bcrypt + httpOnly cookie)
app.post('/api/admin/login', loginLimiter, async (req, res) => {
  if (!JWT_SECRET || !ADMIN_USER || !ADMIN_PASS_HASH) {
    return res.status(503).json({ success: false, message: 'Admin authentication is not configured on server.' });
  }

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid credentials.' });
  }

  const { username, password } = parsed.data;
  const userOk = safeCompare(username, ADMIN_USER);
  const passOk = await bcrypt.compare(password, ADMIN_PASS_HASH);

  if (userOk && passOk) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      message: 'Admin authentication successful',
      user: { username, role: 'admin' },
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

app.get('/api/admin/me', verifyAdminToken, (req, res) => {
  res.json({ success: true, user: { username: req.admin.username, role: req.admin.role } });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: IS_PROD, sameSite: 'lax' });
  res.json({ success: true, message: 'Logged out successfully' });
});

// Contact Form Submission
app.post('/api/contact', formLimiter, async (req, res) => {
  try {
    const parsed = contactSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid contact input.' });
    }

    sendContactNotification(parsed.data).catch((err) => console.error(err.message));

    return res.json({
      success: true,
      message: 'Inquiry received. Our Vedic coordinator will connect with you.',
    });
  } catch (err) {
    console.error('Contact endpoint error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to process inquiry.' });
  }
});

// Create New Booking Enquiry
app.post('/api/bookings', formLimiter, async (req, res) => {
  try {
    const parsed = bookingSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid booking input.' });
    }

    const input = parsed.data;
    let savedBooking;
    if (isMongoConnected) {
      const newBooking = new BookingModel({ ...input, status: 'New' });
      savedBooking = await newBooking.save();
    } else {
      savedBooking = {
        _id: 'bk_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex'),
        ...input,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      localStore.bookings.unshift(savedBooking);
      saveLocalStore();
    }

    sendBookingNotification(savedBooking).catch((err) => console.error(err.message));

    return res.status(201).json({
      success: true,
      message: 'Sacred Puja booking enquiry submitted successfully.',
      booking: savedBooking,
    });
  } catch (error) {
    console.error('Booking error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error while processing booking.' });
  }
});

// Get All Bookings (Admin only)
app.get('/api/bookings', verifyAdminToken, async (req, res) => {
  try {
    const { search, status, puja } = req.query;
    let results = [];
    if (isMongoConnected) {
      const query = {};
      if (status && status !== 'All') query.status = String(status);
      if (puja && puja !== 'All') query.puja = String(puja);
      if (search) {
        const safeSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.$or = [
          { fullName: { $regex: safeSearch, $options: 'i' } },
          { mobile: { $regex: safeSearch, $options: 'i' } },
          { email: { $regex: safeSearch, $options: 'i' } },
          { city: { $regex: safeSearch, $options: 'i' } },
        ];
      }
      results = await BookingModel.find(query).sort({ createdAt: -1 });
    } else {
      results = [...localStore.bookings];
      if (status && status !== 'All') results = results.filter((b) => b.status === status);
      if (puja && puja !== 'All') results = results.filter((b) => b.puja === puja);
      if (search) {
        const s = String(search).toLowerCase();
        results = results.filter((b) =>
          (b.fullName && b.fullName.toLowerCase().includes(s)) ||
          (b.mobile && b.mobile.toLowerCase().includes(s)) ||
          (b.email && b.email.toLowerCase().includes(s)) ||
          (b.city && b.city.toLowerCase().includes(s))
        );
      }
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({ success: true, count: results.length, bookings: results });
  } catch (error) {
    console.error('Fetch bookings error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings.' });
  }
});

// Update Booking Status (Admin only)
app.patch('/api/bookings/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let updated;
    if (isMongoConnected) {
      updated = await BookingModel.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      const index = localStore.bookings.findIndex((b) => b._id === id);
      if (index !== -1) {
        localStore.bookings[index].status = status;
        saveLocalStore();
        updated = localStore.bookings[index];
      }
    }

    if (!updated) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.json({ success: true, message: `Status updated to ${status}`, booking: updated });
  } catch (error) {
    console.error('Update status error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update booking status.' });
  }
});

// Delete Booking (Admin only)
app.delete('/api/bookings/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await BookingModel.findByIdAndDelete(id);
    } else {
      localStore.bookings = localStore.bookings.filter((b) => b._id !== id);
      saveLocalStore();
    }
    return res.json({ success: true, message: 'Booking enquiry deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete booking' });
  }
});

// Brahmin Registration (with email notification to ADMIN_EMAIL)
app.post('/api/brahmins', formLimiter, async (req, res) => {
  try {
    const parsed = brahminSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid Brahmin registration data.' });
    }

    const input = parsed.data;
    let savedBrahmin;
    if (isMongoConnected) {
      const newBrahmin = new BrahminModel({ ...input, status: 'Pending Verification' });
      savedBrahmin = await newBrahmin.save();
    } else {
      savedBrahmin = {
        _id: 'br_' + Date.now() + '_' + crypto.randomBytes(2).toString('hex'),
        ...input,
        status: 'Pending Verification',
        createdAt: new Date().toISOString(),
      };
      localStore.brahmins.unshift(savedBrahmin);
      saveLocalStore();
    }

    sendBrahminNotification(savedBrahmin).catch((err) => console.error(err.message));

    return res.status(201).json({
      success: true,
      message: 'Pranam Acharya ji! Your registration has been received. Our Vedic council will verify and reach out.',
      brahmin: savedBrahmin,
    });
  } catch (error) {
    console.error('Brahmin register error:', error.message);
    return res.status(500).json({ success: false, message: 'Error processing Brahmin application' });
  }
});

// Get Brahmin list (Admin only)
app.get('/api/brahmins', verifyAdminToken, async (req, res) => {
  try {
    let brahmins = [];
    if (isMongoConnected) {
      brahmins = await BrahminModel.find().sort({ createdAt: -1 });
    } else {
      brahmins = localStore.brahmins;
    }
    return res.json({ success: true, count: brahmins.length, brahmins });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to load Brahmins' });
  }
});

// Dashboard Statistics (Admin only)
app.get('/api/stats', verifyAdminToken, async (req, res) => {
  try {
    const allBookings = isMongoConnected ? await BookingModel.find() : localStore.bookings;
    const allBrahmins = isMongoConnected ? await BrahminModel.find() : localStore.brahmins;

    return res.json({
      success: true,
      stats: {
        total: allBookings.length,
        newCount: allBookings.filter((b) => b.status === 'New').length,
        confirmedCount: allBookings.filter((b) => b.status === 'Confirmed').length,
        completedCount: allBookings.filter((b) => b.status === 'Completed').length,
        cancelledCount: allBookings.filter((b) => b.status === 'Cancelled').length,
        totalBrahmins: allBrahmins.length,
      },
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
  }
});

// Reviews: Get published devotee reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = isMongoConnected
      ? await ReviewModel.find().sort({ createdAt: -1 }).limit(50)
      : [...(localStore.reviews || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ success: true, reviews });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to load reviews.' });
  }
});

// Reviews: Submit a new devotee review
app.post('/api/reviews', formLimiter, async (req, res) => {
  try {
    const parsed = reviewSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid review input.' });
    }

    const input = parsed.data;
    const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    let savedReview;

    if (isMongoConnected) {
      const doc = new ReviewModel({ ...input, date: formattedDate });
      savedReview = await doc.save();
    } else {
      savedReview = {
        id: 'rev_' + Date.now() + '_' + crypto.randomBytes(2).toString('hex'),
        ...input,
        date: formattedDate,
        createdAt: new Date().toISOString(),
      };
      if (!Array.isArray(localStore.reviews)) localStore.reviews = [];
      localStore.reviews.unshift(savedReview);
      saveLocalStore();
    }

    return res.status(201).json({ success: true, review: savedReview });
  } catch (error) {
    console.error('Review submit error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Divine Vedic Puja API',
    mongoConnected: isMongoConnected,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🕉️ Divine Vedic Puja Server running securely on port ${PORT}`);
});
