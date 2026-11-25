# Divine Vedic Puja | Vedic Rituals & Pandit Booking Platform

A warm, accessible full-stack Vedic puja and Gurukul-trained Pandit booking platform serving **Jabalpur, Madhya Pradesh** and across India.

## Features
- **Warm Light Vedic Theme**: `#FFF8EC` page background, `#FBEBD0` alternate sections, `#FFFFFF` cards (`#EBD5B0` borders), `#4A1C0C` headings, `#E65100` saffron primary actions, and `#3B1208` maroon hero/footer accents.
- **Responsive Mobile & Laptop UI**: Mobile-first layout with sticky 3-button bottom bar (`Call`, `WhatsApp`, `Book Puja`), full-screen mobile drawer, and two-column laptop hero & booking layouts.
- **Bilingual Support**: Default English with instant persistent English/Hindi language switching.
- **10 Vedic Puja Services**: Compact service cards with WebP imagery (`<picture>` fallback), `"Contact for price"`, and `"What is included / Samagri"` details.
- **Interactive Booking & Contact**: Zod-validated forms, confirmation screen with reference ID + prefilled WhatsApp button, and Nodemailer notifications to `001stiwari9589@gmail.com`.
- **Real Devotee Reviews**: Dynamic reviews from `/api/reviews` with a `"Share your experience"` submission form.
- **Hidden Admin Portal (`/admin`)**: Protected with `bcrypt` password hashing, `httpOnly` JWT cookies, `helmet`, and `express-rate-limit`.

## Setup

### 1. Configure Environment
Copy `server/.env.example` to `server/.env` and fill in your own secrets:
- Generate a strong `JWT_SECRET`.
- Set `ADMIN_USER` and `ADMIN_PASS_HASH` (generate bcrypt hash via `node -e "import('bcryptjs').then(b=>console.log(b.default.hashSync('YOUR_PASSWORD', 12)))"`).
- For Gmail SMTP, generate a 16-character **Gmail App Password** (normal Gmail passwords will not work).

### 2. Run Backend & Frontend
```bash
cd server && npm install && npm start
cd client && npm install && npm run dev
```

### 3. Hero Video Asset
Download a free HD puja video from Pexels or Pixabay (free licence), compress to under 6 MB, and place it in `/public/videos/puja-hero.mp4` (inside `client/public/videos/puja-hero.mp4`). Until the video file is placed, the Hero card gracefully displays `/images/puja-hero-poster.jpg`.

### 4. Production Build
```bash
cd client && npm run build
```
