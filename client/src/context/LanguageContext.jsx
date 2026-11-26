import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Only 2 languages: English (Default) & Hindi
export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', native: 'English' },
  { code: 'hi', label: 'Hindi', short: 'HI', native: 'हिन्दी' },
];

export const TRANSLATIONS = {
  en: {
    brandSub: 'Pujan & Sanskar',
    nav: {
      home: 'Home',
      services: 'Our Services',
      about: 'About Us',
      bookPuja: 'Book a Puja',
      faqs: 'FAQs',
      contact: 'Contact',
      callNow: 'Call Now',
      playOm: 'Play Ambient Om Chanting',
      playingOm: '136.1Hz Sacred Om Playing',
      callNumber: 'Call +91 95890 18011',
      languageLabel: 'Language',
    },
    hero: {
      invocation: 'Om Shri Ganeshaya Namah',
      title: 'Vedic Rituals & Sacred Ceremonies',
      subtitlePrefix: '"Experience authentic Vedic rituals performed by experienced',
      subtitleHighlight: 'Gurukul-trained Brahmins',
      subtitleSuffix: '. We bring divine blessings to your home with pure devotion and strict adherence to sacred scriptures."',
      bookNow: 'Book a Pooja Now',
      whatsappBtn: 'WhatsApp Pandit Ji',
      stat1Label: 'Pujas Completed',
      stat2Label: 'Gurukul Acharyas',
      stat3Label: 'Vedic Samagri',
      explore: 'Explore',
    },
    services: {
      badge: 'Divine Sansthan Catalog',
      title: 'Our Sacred Services',
      subtitle: '"Traditional rituals performed with devotion by North Hindi Pandit, Hindi Pandit, Bihari Pandit, and Gurukul-trained Vedic Pandit Ji for all online puja services."',
      viewVidhi: 'View Vidhi',
      bookPuja: 'Book Puja',
      duration: 'Duration',
      pandits: 'Acharyas',
      samagri: 'Samagri Included',
      keyRitualsTitle: 'Key Sacred Rituals',
      benefits: 'Spiritual Benefits',
      bookThis: 'Book This Puja Now',
      items: {
        'griha-pravesh': {
          name: 'Griha Pravesh Puja',
          category: 'Vastu & Home',
          tagline: 'Auspicious entry into your new home invoking divine prosperity and positive energy.',
        },
        'satyanarayan-katha': {
          name: 'Satyanarayan Katha',
          category: 'Blessings & Peace',
          tagline: 'Sacred recitation of Lord Vishnu glory for happiness, peace, and family fulfillment.',
        },
        'ganesh-puja': {
          name: 'Ganesh Puja & Havan',
          category: 'New Beginnings',
          tagline: 'Invoking Lord Ganesha, the remover of obstacles, before any new venture or milestone.',
        },
        'rudrabhishek': {
          name: 'Maha Rudrabhishek',
          category: 'Healing & Peace',
          tagline: 'Sacred Vedic ablution of Lord Shiva with powerful Sri Rudram chanting.',
        },
        'vastu-shanti': {
          name: 'Vastu Shanti Puja',
          category: 'Vastu Harmony',
          tagline: 'Harmonizing universal cosmic energies and the five elements in your living space.',
        },
        'marriage-ceremony': {
          name: 'Vedic Vivah Sanskar',
          category: 'Sacred Sanskar',
          tagline: 'Solemnizing the divine union of two souls under authentic Vedic scriptures.',
        },
        'havan-navagraha': {
          name: 'Maha Havan & Navagraha',
          category: 'Fire Ritual',
          tagline: 'Purifying cosmic energies through sacred Agni and nine planetary deities.',
        },
        'bhoomi-pujan': {
          name: 'Bhoomi Pujan',
          category: 'Foundation Ritual',
          tagline: 'Seeking permission and blessings of Mother Earth before starting construction.',
        },
        'naamkaran': {
          name: 'Naamkaran Sanskar',
          category: 'Child Sanskar',
          tagline: 'Bestowing an auspicious Vedic name on the newborn based on birth constellation.',
        },
        'mundan-ceremony': {
          name: 'Mundan Sanskar',
          category: 'Child Sanskar',
          tagline: 'Sacred first hair-shaving ceremony for longevity, purity, and mental awakening.',
        },
        'bhagwat-katha': {
          name: 'Shrimad Bhagwat Katha',
          category: 'Sacred Katha',
          tagline: 'Sacred recitation of Shrimad Bhagwat Mahapuran for devotion, peace, and family harmony.',
        },
        'sundarkand-katha': {
          name: 'Sundarkand Path & Ramayan Katha',
          category: 'Sacred Katha',
          tagline: 'Devotional chanting of Sundarkand & Ramayan Katha for courage, positivity, and protection.',
        },
        'lakshmi-puja': {
          name: 'Lakshmi Puja & Dhanteras Pujan',
          category: 'Wealth & Prosperity',
          tagline: 'Invoking Goddess Mahalakshmi and Lord Kuber for abundance, business growth, and home prosperity.',
        },
        'mahamrityunjaya-jaap': {
          name: 'Mahamrityunjaya Jaap & Havan',
          category: 'Health & Protection',
          tagline: 'Powerful Vedic mantra anushthan of Lord Shiva for health recovery, longevity, and protection.',
        },
        'kaal-sarp-puja': {
          name: 'Kaal Sarp & Pitra Dosh Puja',
          category: 'Dosh Nivaran',
          tagline: 'Authentic Vedic Shanti rituals to pacify planetary doshas and seek ancestral blessings.',
        },
        'durga-saptashati': {
          name: 'Durga Saptashati & Chandi Havan',
          category: 'Shakti & Protection',
          tagline: 'Sacred recitation of Devi Mahatmya and Chandi Havan for strength, victory, and family protection.',
        },
        'office-opening-puja': {
          name: 'Office / Shop Opening Puja',
          category: 'Business & Career',
          tagline: 'Auspicious Vastu, Ganesh, and Lakshmi Pujan for new offices, shops, factories, and startups.',
        },
        'any-other-puja': {
          name: 'Any Other Puja & Havan',
          category: 'Custom Vedic Ritual',
          tagline: 'Need a specific Puja, Katha, Jaap, or Sanskar? Select this option and book any customized Vedic ritual.',
        },
      },
    },
    about: {
      badge: 'Sanatana Heritage & Tradition',
      title: 'Preserving the Sacred Traditions',
      shastraTitle: '100% Shastra Compliant',
      shastraSub: 'Authentic Vedic Vidhi',
      p1Prefix: 'For centuries, ancient Vedic rituals have sustained spiritual peace, cosmic balance, and family prosperity. At ',
      p1Brand: 'Divine Vedic Puja',
      p1Suffix: ', we are committed to preserving the uncompromised sanctity of sacred ceremonies in modern homes.',
      p2: 'Whether you are searching for a Pandit Ji near me, North Hindi Pandit, Bihari Pandit, Namkaran Pandit, or Vivah Hetu Pandit, our Gurukul-trained Acharyas bring deep mastery of Vedic mantras, Muhurat calculations, and authentic Shodashopachara worship directly to your home.',
      highlights: [
        {
          title: 'Experienced Brahmins',
          desc: 'Formally initiated Vedic scholars from Kashi, Ujjain, and Haridwar with 12+ years of ritual experience.',
        },
        {
          title: 'Authentic Vedic Practices',
          desc: 'Uncompromised recitation of Yajurveda and Rigveda mantras with genuine Shodashopachara Vidhi.',
        },
        {
          title: 'Personalised Puja Services',
          desc: 'Ceremonies tailored to your family Gotra, Janma Nakshatra, and exact Shubh Muhurat.',
        },
        {
          title: 'Traditional Ritual Guidance',
          desc: 'Complete pre-puja checklist, pure havan samagri, and clear explanation of every ritual.',
        },
      ],
    },
    whyUs: {
      badge: 'Divine Assurance & Sanctity',
      title: 'Why Choose Divine Vedic Puja',
      subtitle: '"We uphold the eternal purity of ancient traditions so your sacred ceremonies bring joy, peace, and divine protection."',
      cards: [
        {
          subtitle: 'Gurukul Verified Acharyas',
          title: 'Experienced Pandits',
          desc: 'All our Brahmins are certified from renowned Vedic institutions in Varanasi, Haridwar & Mathura with profound mantra pronunciation.',
        },
        {
          subtitle: 'Strict Shastra Adherence',
          title: 'Authentic Vedic Rituals',
          desc: 'We follow traditional Vedic paddhati without shortcuts, using pure cow desi ghee and authentic sacred samagri.',
        },
        {
          subtitle: 'Seamless Digital Booking',
          title: 'Easy Puja Booking',
          desc: 'Book your ceremony in under 2 minutes with transparent details, quick confirmation, and direct WhatsApp assistance.',
        },
        {
          subtitle: 'Dedicated Acharya Support',
          title: 'Personalised Assistance',
          desc: 'Senior Jyotish Acharyas help determine exact Shubh Muhurat and guide you through Gotra sankalp details.',
        },
      ],
    },
    howItWorks: {
      badge: 'Seamless & Reverent',
      title: 'How It Works',
      subtitle: '"A simple four-step process to bring authentic Vedic blessings into your home with ease."',
      steps: [
        {
          title: 'Choose Your Puja',
          desc: 'Browse our catalog of Vedic ceremonies including Griha Pravesh, Rudrabhishek, and Satyanarayan Katha.',
        },
        {
          title: 'Share Requirements',
          desc: 'Enter your preferred date, time slot, full address, preferred language, and Gotra details.',
        },
        {
          title: 'Connect With Our Team',
          desc: 'Our Vedic coordinator connects with you to confirm exact Shubh Muhurat and samagri checklist.',
        },
        {
          title: 'Confirm & Conduct Puja',
          desc: 'Our Gurukul Acharyas arrive punctually at your venue with sacred samagri to perform the ceremony.',
        },
      ],
    },
    booking: {
      badge: 'Auspicious Sankalpa',
      title: 'Book Your Sacred Ceremony',
      subtitle: '"Begin your sacred ritual with divine grace. Fill the form below and our Acharyas will coordinate the Muhurat and preparation."',
      fullName: 'Full Name *',
      fullNamePh: 'Enter your full name',
      mobile: 'Mobile Number *',
      mobilePh: 'Enter 10-digit mobile number',
      email: 'Email Address *',
      emailPh: 'Enter your email address',
      selectPuja: 'Select Puja *',
      selectPujaPh: '-- Choose Puja --',
      preferredDate: 'Preferred Date *',
      preferredTime: 'Preferred Time Slot *',
      preferredTimePh: '-- Choose Time Slot --',
      city: 'City & Full Address *',
      cityPh: 'Enter your city and full address',
      language: 'Preferred Pandit Language *',
      languagePh: '-- Choose Language --',
      gotra: 'Gotra (Optional)',
      gotraPh: 'Enter your Gotra (optional)',
      requirements: 'Special Requirements (Optional)',
      requirementsPh: 'Enter any special puja requirements',
      submitBtn: 'Confirm Sacred Puja Booking',
      submitting: 'Submitting Booking...',
      privacyNote: 'Your contact details are kept strictly private and used only for your puja coordination.',
      errors: {
        fullNameReq: 'Please enter your full name.',
        fullNameMin: 'Full name must be at least 2 characters (letters only).',
        mobileReq: 'Please enter your mobile number.',
        mobileInvalid: 'Please enter a valid 10-digit Indian mobile number.',
        emailReq: 'Please enter your email address.',
        emailInvalid: 'Please enter a valid email address.',
        pujaReq: 'Please choose a Puja ceremony.',
        dateReq: 'Please select a preferred date.',
        datePast: 'Preferred date cannot be in the past.',
        timeReq: 'Please choose a preferred time slot.',
        cityReq: 'Please enter your city and full address (min 3 characters).',
        langReq: 'Please choose your preferred Pandit language.',
      },
      timeOptions: [
        'Brahmamuhurta (04:30 AM - 06:30 AM)',
        'Morning (06:00 AM - 09:00 AM)',
        'Midday (10:00 AM - 01:00 PM)',
        'Evening (05:00 PM - 08:30 PM)',
        'Consult Acharya for Shubh Muhurat',
      ],
      langOptions: [
        'English & Sanskrit',
        'Hindi & Sanskrit',
        'Pure Sanskrit',
        'Gujarati',
        'Marathi',
        'Bengali',
        'Telugu',
        'Tamil',
      ],
    },
    testimonials: {
      badge: 'Devotee Experiences & Reviews',
      title: 'Devotee Reviews',
      writeReviewBtn: 'Write a Review',
      hideReviewBtn: 'Close Review Form',
      formTitle: 'Share Your Puja Experience',
      namePh: 'Enter your full name',
      cityPh: 'Enter your city (e.g. Bengaluru)',
      pujaPh: 'Enter Puja name (e.g. Griha Pravesh)',
      commentPh: 'Share your experience with our Pandit Ji...',
      ratingLabel: 'Your Rating',
      submitReview: 'Submit Review',
      submittingReview: 'Submitting...',
      reviewSuccess: 'Thank you! Your review has been published.',
      reviewError: 'Please fill in your name, city, puja name, and review comment.',
    },
    faqs: {
      badge: 'Frequently Asked Inquiries',
      title: 'Sacred Guidance & FAQs',
      subtitle: '"Click any question below to view details about our Vedic pandits, samagri, and booking process."',
      items: [
        {
          id: 'faq-1',
          question: 'How can I book a verified Pandit through Divine Vedic Puja?',
          answer: 'Booking takes less than 2 minutes. Choose your Puja from our catalog, fill out the booking form with your date, time slot, address, and language preference. Our coordinator will promptly call or message you on WhatsApp to confirm the Shubh Muhurat.',
        },
        {
          id: 'faq-2',
          question: 'Which sacred pujas and ceremonies are available?',
          answer: 'We conduct Griha Pravesh, Satyanarayan Katha, Maha Rudrabhishek, Vastu Shanti, Ganesh Puja, Maha Havan & Navagraha Shanti, Bhoomi Pujan, Vedic Vivah Sanskar, Naamkaran, and Mundan ceremonies.',
        },
        {
          id: 'faq-3',
          question: 'Can I request an English, Hindi, or regional language speaking Pandit?',
          answer: 'Yes. Our council includes Gurukul-trained Acharyas fluent in English, Hindi, Sanskrit, Gujarati, Marathi, Bengali, Telugu, and Tamil so rituals are clearly explained in your preferred language.',
        },
        {
          id: 'faq-4',
          question: 'Can I arrange a puja at my home or at an external venue?',
          answer: 'Yes! Our Pandits travel directly to your home, apartment, office, or event venue with all required arrangements.',
        },
        {
          id: 'faq-5',
          question: 'How is the booking confirmed? Will I receive a confirmation?',
          answer: 'Right after submitting the form, you receive an instant digital confirmation and email notification, followed by a confirmation call from our coordinator within 30 minutes.',
        },
        {
          id: 'faq-6',
          question: 'Is authentic Puja Samagri included in the package?',
          answer: 'Yes. All our packages can include complete Vedic samagri such as pure cow ghee, Gangajal, havan herbs, Kalash, and sacred woods. Only fresh fruits and flowers need to be arranged locally.',
        },
        {
          id: 'faq-7',
          question: 'How do you determine the Shubh Muhurat (auspicious time)?',
          answer: 'Our Vedic Jyotish Acharyas calculate the most auspicious Muhurat based on the Panchang, Tithi, Nakshatra, and your family details.',
        },
      ],
    },
    contact: {
      badge: 'Direct Helpline',
      title: 'Contact Pandit Ji',
      subheading: 'Direct Call & WhatsApp Support',
      desc: 'Need immediate assistance for Puja booking, Muhurat consultation, or Samagri details? Connect directly via Phone, WhatsApp, or Email.',
      callLabel: 'Call Pandit Ji',
      callSub: 'Tap icon to call directly (24x7)',
      whatsappLabel: 'WhatsApp Pandit Ji',
      whatsappValue: 'Tap to chat on WhatsApp',
      emailLabel: 'Send Email',
      emailSub: '001stiwari9589@gmail.com',
      gmailBtn: 'Open in Gmail',
      formTitle: 'Quick Contact Message',
      formSubtitle: 'Send your details and we will call or email you right back.',
      nameLabel: 'Your Name *',
      namePh: 'Enter your full name',
      phoneLabel: 'Phone Number *',
      phonePh: 'Enter 10-digit mobile number',
      emailInputLabel: 'Email Address *',
      emailPh: 'Enter your email address',
      messageLabel: 'Your Message *',
      messagePh: 'Enter your puja inquiry or preferred date',
      sendBtn: 'Send Message',
      sendingBtn: 'Sending...',
      sentTitle: 'Message Sent Successfully',
      sentDesc: 'Our coordinator will contact you shortly.',
    },
    footer: {
      shloka: 'May all beings be happy, may all be free from illness, may all see what is auspicious, and may no one suffer.',
      shlokaMeaning: 'Universal Vedic Blessing for Peace and Harmony',
      bio: 'Authentic Vedic ceremonies and Gurukul-trained Pandits at your doorstep with complete devotion and precision.',
      quickNav: 'Quick Navigation',
      sacredCeremonies: 'Sacred Ceremonies',
      vedicHelpline: 'Vedic Helpline',
      home: 'Home',
      catalog: 'Our Services',
      about: 'About Us',
      bookNow: 'Book a Puja',
      faqs: 'FAQs',
      contact: 'Contact',
    },
  },

  hi: {
    brandSub: 'पूजन एवं संस्कार',
    nav: {
      home: 'होम',
      services: 'हमारी सेवाएं',
      about: 'हमारे बारे में',
      bookPuja: 'पूजा बुक करें',
      faqs: 'सामान्य प्रश्न',
      contact: 'संपर्क करें',
      callNow: 'कॉल करें',
      playOm: 'पवित्र ॐ नाद सुनें',
      playingOm: '136.1Hz ॐ नाद चालू है',
      callNumber: 'कॉल +91 95890 18011',
      languageLabel: 'भाषा चुनें',
    },
    hero: {
      invocation: 'ॐ श्री गणेशाय नमः',
      title: 'वैदिक अनुष्ठान एवं पवित्र संस्कार',
      subtitlePrefix: '"अनुभवी',
      subtitleHighlight: 'गुरुकुल-प्रशिक्षित विद्वान ब्राह्मणों',
      subtitleSuffix: ' द्वारा संपन्न प्रामाणिक वैदिक पूजा का अनुभव करें। हम पूर्ण भक्ति और शास्त्रोक्त विधि के साथ आपके घर दिव्य आशीर्वाद लाते हैं।"',
      bookNow: 'अभी पूजा बुक करें',
      whatsappBtn: 'व्हाट्सएप पंडित जी',
      stat1Label: 'संपन्न पूजाएं',
      stat2Label: 'गुरुकुल आचार्य',
      stat3Label: 'शुद्ध वैदिक सामग्री',
      explore: 'आगे देखें',
    },
    services: {
      badge: 'दिव्य संस्थान सेवा सूची',
      title: 'हमारी पवित्र सेवाएं',
      subtitle: '"गुरुकुल विद्वानों के पावन मार्गदर्शन में पूर्ण भक्ति और प्रामाणिक वैदिक पद्धति से संपन्न पारंपरिक अनुष्ठान।"',
      viewVidhi: 'विधि देखें',
      bookPuja: 'पूजा बुक करें',
      duration: 'अवधि',
      pandits: 'आचार्य',
      samagri: 'सामग्री सहित',
      keyRitualsTitle: 'मुख्य वैदिक विधियां',
      benefits: 'आध्यात्मिक लाभ',
      bookThis: 'अभी यह पूजा बुक करें',
      items: {
        'griha-pravesh': {
          name: 'गृह प्रवेश पूजा',
          category: 'वास्तु एवं गृह शांति',
          tagline: 'नए घर में सुख, समृद्धि और सकारात्मक ऊर्जा के लिए शुभ प्रवेश पूजन।',
        },
        'satyanarayan-katha': {
          name: 'सत्यनारायण कथा',
          category: 'सुख एवं समृद्धि',
          tagline: 'परिवार की सुख-शांति और मनोकामना पूर्ति के लिए भगवान विष्णु की पावन कथा।',
        },
        'ganesh-puja': {
          name: 'गणेश पूजा एवं हवन',
          category: 'शुभ आरंभ',
          tagline: 'किसी भी नए कार्य, व्यापार या शुभ अवसर के निर्विघ्न पूर्ण होने के लिए गणेश पूजन।',
        },
        'rudrabhishek': {
          name: 'महा रुद्राभिषेक',
          category: 'आध्यात्मिक शांति',
          tagline: 'शुक्ल यजुर्वेद के मंत्रों के साथ भगवान शिव का पावन वैदिक रुद्राभिषेक।',
        },
        'vastu-shanti': {
          name: 'वास्तु शांति पूजा',
          category: 'वास्तु दोष निवारण',
          tagline: 'घर और कार्यस्थल के पंचतत्वों व दिशाओं की ऊर्जा को संतुलित करने का अनुष्ठान।',
        },
        'marriage-ceremony': {
          name: 'वैदिक विवाह संस्कार',
          category: 'पवित्र संस्कार',
          tagline: 'शुद्ध वैदिक मंत्रोच्चार और सप्तपदी के साथ पावन विवाह संस्कार।',
        },
        'havan-navagraha': {
          name: 'महा हवन एवं नवग्रह शांति',
          category: 'अग्नि अनुष्ठान',
          tagline: 'नवग्रहों की शांति और सकारात्मक ऊर्जा के लिए पवित्र वैदिक हवन।',
        },
        'bhoomi-pujan': {
          name: 'भूमि पूजन एवं शिलान्यास',
          category: 'निर्माण आरंभ',
          tagline: 'भवन निर्माण प्रारंभ करने से पूर्व धरती माता के आशीर्वाद हेतु पावन पूजन।',
        },
        'naamkaran': {
          name: 'नामकरण संस्कार',
          category: 'शिशु संस्कार',
          tagline: 'नवजात शिशु के जन्म नक्षत्र के अनुसार शुभ वैदिक नामकरण संस्कार।',
        },
        'mundan-ceremony': {
          name: 'मुंडन संस्कार',
          category: 'शिशु संस्कार',
          tagline: 'शिशु की दीर्घायु, पवित्रता और बुद्धि विकास के लिए पारंपरिक मुंडन संस्कार।',
        },
        'bhagwat-katha': {
          name: 'श्रीमद् भागवत कथा',
          category: 'पावन कथा',
          tagline: 'भक्ति, आध्यात्मिक शांति और परिवार कल्याण हेतु श्रीमद् भागवत महापुराण की पावन कथा।',
        },
        'sundarkand-katha': {
          name: 'सुंदरकांड पाठ एवं रामायण कथा',
          category: 'पावन कथा',
          tagline: 'सकारात्मक ऊर्जा, साहस और सुख-शांति के लिए संगीतमय सुंदरकांड पाठ एवं रामायण कथा।',
        },
        'lakshmi-puja': {
          name: 'लक्ष्मी पूजा एवं धनतेरस पूजन',
          category: 'धन एवं समृद्धि',
          tagline: 'घर और व्यापार में सुख-समृद्धि एवं धन-धान्य के लिए माँ लक्ष्मी और कुबेर जी का वैदिक पूजन।',
        },
        'mahamrityunjaya-jaap': {
          name: 'महामृत्युंजय जप एवं हवन',
          category: 'स्वास्थ्य एवं रक्षा',
          tagline: 'उत्तम स्वास्थ्य, दीर्घायु और संकट निवारण हेतु गुरुकुल आचार्यों द्वारा महामृत्युंजय मंत्र अनुष्ठान।',
        },
        'kaal-sarp-puja': {
          name: 'कालसर्प एवं पितृ दोष निवारण पूजा',
          category: 'दोष निवारण',
          tagline: 'ग्रह दोषों की शांति और पितरों के आशीर्वाद हेतु शुद्ध शास्त्रोक्त वैदिक अनुष्ठान।',
        },
        'durga-saptashati': {
          name: 'दुर्गा सप्तशती पाठ एवं चंडी हवन',
          category: 'शक्ति एवं सुरक्षा',
          tagline: 'नकारात्मकता से रक्षा, साहस और विजय प्राप्ति हेतु माँ दुर्गा का पावन पाठ एवं हवन।',
        },
        'office-opening-puja': {
          name: 'ऑफिस / दुकान उद्घाटन पूजा',
          category: 'व्यापार एवं उन्नति',
          tagline: 'नए कार्यालय, दुकान या व्यापार की शुभ शुरुआत हेतु गणेश-लक्ष्मी एवं वास्तु पूजन।',
        },
        'any-other-puja': {
          name: 'अन्य कोई पूजा एवं हवन (Any Other Puja)',
          category: 'विशेष वैदिक अनुष्ठान',
          tagline: 'यदि आप कोई अन्य पूजा, पाठ, जप या संस्कार कराना चाहते हैं, तो इसे चुनकर बुकिंग करें।',
        },
      },
    },
    about: {
      badge: 'सनातन धरोहर एवं परंपरा',
      title: 'पवित्र परंपराओं का संरक्षण',
      shastraTitle: '100% शास्त्र सम्मत',
      shastraSub: 'शुद्ध सनातन वैदिक विधि',
      p1Prefix: 'सदियों से प्राचीन वैदिक अनुष्ठानों ने आध्यात्मिक शांति और पारिवारिक समृद्धि को बनाए रखा है। ',
      p1Brand: 'डिवाइन वैदिक पूजा',
      p1Suffix: ' में हम आधुनिक जीवन में पवित्र संस्कारों की शुद्धता को बनाए रखने के लिए समर्पित हैं।',
      p2: 'हमारे आदरणीय आचार्य पारंपरिक गुरुकुलों से प्रशिक्षित हैं। वे वैदिक मंत्रों, शुभ मुहूर्त गणना और शुद्ध षोडशोपचार पूजन को आपके घर तक लाते हैं।',
      highlights: [
        {
          title: 'अनुभवी ब्राह्मण',
          desc: 'काशी, उज्जैन और हरिद्वार से 12+ वर्षों के अनुभव वाले प्रमाणित वैदिक विद्वान।',
        },
        {
          title: 'प्रामाणिक वैदिक विधि',
          desc: 'यजुर्वेद और ऋग्वेद मंत्रों के साथ शुद्ध षोडशोपचार विधि का पूर्ण पालन।',
        },
        {
          title: 'व्यक्तिगत पूजा सेवाएं',
          desc: 'आपके परिवार के गोत्र, जन्म नक्षत्र और सटीक शुभ मुहूर्त के अनुसार विशेष पूजन।',
        },
        {
          title: 'पारंपरिक अनुष्ठान मार्गदर्शन',
          desc: 'पूजा से पूर्व पूर्ण सूची, शुद्ध हवन सामग्री और प्रत्येक विधि का सरल विवरण।',
        },
      ],
    },
    whyUs: {
      badge: 'दिव्य विश्वास एवं पवित्रता',
      title: 'डिवाइन वैदिक पूजा क्यों चुनें',
      subtitle: '"हम प्राचीन परंपराओं की शाश्वत पवित्रता को बनाए रखते हैं ताकि आपके अनुष्ठान असीम सुख और शांति प्रदान करें।"',
      cards: [
        {
          subtitle: 'गुरुकुल प्रमाणित आचार्य',
          title: 'अनुभवी पंडित जी',
          desc: 'हमारे सभी ब्राह्मण वाराणसी, हरिद्वार और मथुरा के प्रसिद्ध वैदिक संस्थानों से प्रमाणित और शुद्ध मंत्रोच्चारण में निपुण हैं।',
        },
        {
          subtitle: 'पूर्ण शास्त्र सम्मत',
          title: 'शुद्ध वैदिक अनुष्ठान',
          desc: 'हम बिना किसी शॉर्टकट के पारंपरिक वैदिक पद्धति, शुद्ध देसी घी और पवित्र सामग्री का उपयोग करते हैं।',
        },
        {
          subtitle: 'सरल ऑनलाइन बुकिंग',
          title: 'आसान पूजा बुकिंग',
          desc: '2 मिनट से कम समय में पूजा बुक करें, तुरंत पुष्टि और सीधी फोन/व्हाट्सएप सहायता पाएं।',
        },
        {
          subtitle: 'समर्पित आचार्य सहयोग',
          title: 'व्यक्तिगत मार्गदर्शन',
          desc: 'वरिष्ठ ज्योतिष आचार्य सटीक शुभ मुहूर्त निकालने और गोत्र संकल्प में आपकी सहायता करते हैं।',
        },
      ],
    },
    howItWorks: {
      badge: 'सरल एवं श्रद्धापूर्ण प्रक्रिया',
      title: 'यह कैसे कार्य करता है',
      subtitle: '"पूर्ण श्रद्धा और सहजता के साथ आपके घर में वैदिक आशीर्वाद लाने की चार चरणों वाली सरल प्रक्रिया।"',
      steps: [
        {
          title: 'अपनी पूजा चुनें',
          desc: 'गृह प्रवेश, रुद्राभिषेक और सत्यनारायण कथा सहित वैदिक अनुष्ठानों की सूची में से चुनें।',
        },
        {
          title: 'विवरण साझा करें',
          desc: 'अपनी पसंदीदा तिथि, शुभ समय, पूरा पता, भाषा और गोत्र का विवरण दर्ज करें।',
        },
        {
          title: 'हमारी टीम से जुड़ें',
          desc: 'हमारे वैदिक समन्वयक शुभ मुहूर्त और पूजन सामग्री सूची की पुष्टि के लिए आपसे संपर्क करेंगे।',
        },
        {
          title: 'पुष्टि एवं पूजा संपन्न',
          desc: 'हमारे गुरुकुल आचार्य पूर्ण पवित्र सामग्री के साथ समय पर पहुंचकर पूजा संपन्न कराएंगे।',
        },
      ],
    },
    booking: {
      badge: 'शुभ संकल्प',
      title: 'अपना पवित्र अनुष्ठान बुक करें',
      subtitle: '"दिव्य कृपा के साथ अपना अनुष्ठान प्रारंभ करें। नीचे विवरण भरें, हमारे आचार्य मुहूर्त और तैयारी का समन्वय करेंगे।"',
      fullName: 'पूरा नाम *',
      fullNamePh: 'अपना पूरा नाम दर्ज करें',
      mobile: 'मोबाइल नंबर *',
      mobilePh: '10 अंकों का मोबाइल नंबर दर्ज करें',
      email: 'ईमेल पता *',
      emailPh: 'अपना ईमेल पता दर्ज करें',
      selectPuja: 'पूजा चुनें *',
      selectPujaPh: '-- पूजा चुनें --',
      preferredDate: 'पसंदीदा तिथि *',
      preferredTime: 'शुभ समय चुनें *',
      preferredTimePh: '-- शुभ समय चुनें --',
      city: 'शहर एवं पूरा पता *',
      cityPh: 'अपना शहर और पूरा पता दर्ज करें',
      language: 'पंडित जी की भाषा *',
      languagePh: '-- भाषा चुनें --',
      gotra: 'गोत्र (वैकल्पिक)',
      gotraPh: 'अपना गोत्र दर्ज करें (वैकल्पिक)',
      requirements: 'विशेष निर्देश (वैकल्पिक)',
      requirementsPh: 'कोई विशेष पूजा आवश्यकता दर्ज करें',
      submitBtn: 'पूजा बुकिंग की पुष्टि करें',
      submitting: 'बुकिंग भेजी जा रही है...',
      privacyNote: 'आपकी जानकारी पूर्णतः गोपनीय रखी जाती है और केवल पूजा समन्वय के लिए उपयोग होती है।',
      errors: {
        fullNameReq: 'कृपया अपना पूरा नाम दर्ज करें।',
        fullNameMin: 'नाम कम से कम 2 अक्षरों का होना चाहिए।',
        mobileReq: 'कृपया अपना मोबाइल नंबर दर्ज करें।',
        mobileInvalid: 'कृपया सही 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।',
        emailReq: 'कृपया अपना ईमेल पता दर्ज करें।',
        emailInvalid: 'कृपया सही ईमेल पता दर्ज करें।',
        pujaReq: 'कृपया एक पूजा चुनें।',
        dateReq: 'कृपया पसंदीदा तिथि चुनें।',
        datePast: 'पसंदीदा तिथि आज से पहले की नहीं हो सकती।',
        timeReq: 'कृपया शुभ समय चुनें।',
        cityReq: 'कृपया अपना शहर और पूरा पता दर्ज करें।',
        langReq: 'कृपया पंडित जी की भाषा चुनें।',
      },
      timeOptions: [
        'ब्रह्ममुहूर्त (04:30 AM - 06:30 AM)',
        'प्रातःकाल (06:00 AM - 09:00 AM)',
        'मध्याह्न (10:00 AM - 01:00 PM)',
        'सायंकाल (05:00 PM - 08:30 PM)',
        'शुभ मुहूर्त हेतु आचार्य से परामर्श',
      ],
      langOptions: [
        'अंग्रेजी एवं संस्कृत',
        'हिंदी एवं संस्कृत',
        'शुद्ध संस्कृत',
        'गुजराती',
        'मराठी',
        'बंगाली',
        'तेलुगु',
        'तमिल',
      ],
    },
    testimonials: {
      badge: 'भक्तों के अनुभव एवं समीक्षा',
      title: 'भक्तों के अनुभव (Reviews)',
      writeReviewBtn: 'समीक्षा लिखें',
      hideReviewBtn: 'फॉर्म बंद करें',
      formTitle: 'अपना पूजा अनुभव साझा करें',
      namePh: 'अपना पूरा नाम दर्ज करें',
      cityPh: 'अपना शहर दर्ज करें (जैसे बेंगलुरु)',
      pujaPh: 'पूजा का नाम दर्ज करें (जैसे गृह प्रवेश)',
      commentPh: 'पंडित जी के साथ अपना अनुभव लिखें...',
      ratingLabel: 'आपकी रेटिंग',
      submitReview: 'समीक्षा सबमिट करें',
      submittingReview: 'सबमिट हो रहा है...',
      reviewSuccess: 'धन्यवाद! आपकी समीक्षा सफलतापूर्वक प्रकाशित हो गई है।',
      reviewError: 'कृपया अपना नाम, शहर, पूजा का नाम और अनुभव दर्ज करें।',
    },
    faqs: {
      badge: 'सामान्यतः पूछे जाने वाले प्रश्न',
      title: 'वैदिक मार्गदर्शन एवं प्रश्नोत्तर',
      subtitle: '"हमारे वैदिक पंडितों, सामग्री और बुकिंग प्रक्रिया के बारे में जानने के लिए किसी भी प्रश्न पर क्लिक करें।"',
      items: [
        {
          id: 'faq-1',
          question: 'डिवाइन वैदिक पूजा से प्रमाणित पंडित जी कैसे बुक करें?',
          answer: 'बुकिंग में 2 मिनट से भी कम समय लगता है। हमारी सूची से पूजा चुनें और बुकिंग फॉर्म में तिथि, समय, पता और भाषा भरें। हमारे समन्वयक तुरंत कॉल या व्हाट्सएप द्वारा शुभ मुहूर्त की पुष्टि करेंगे।',
        },
        {
          id: 'faq-2',
          question: 'कौन-कौन सी वैदिक पूजाएं उपलब्ध हैं?',
          answer: 'हमारे पास गृह प्रवेश, सत्यनारायण कथा, महा रुद्राभिषेक, वास्तु शांति, गणेश पूजा, महा हवन एवं नवग्रह शांति, भूमि पूजन, वैदिक विवाह संस्कार, नामकरण और मुंडन संस्कार की संपूर्ण सेवाएं उपलब्ध हैं।',
        },
        {
          id: 'faq-3',
          question: 'क्या मैं हिंदी, अंग्रेजी या क्षेत्रीय भाषा के पंडित जी चुन सकता हूँ?',
          answer: 'जी हां। हमारे पास हिंदी, अंग्रेजी, संस्कृत, गुजराती, मराठी, बंगाली, तेलुगु और तमिल भाषा में निपुण गुरुकुल आचार्य उपलब्ध हैं।',
        },
        {
          id: 'faq-4',
          question: 'क्या पूजा घर के अलावा कार्यालय या किसी अन्य स्थान पर भी हो सकती है?',
          answer: 'जी हां, हमारे पंडित जी आपके घर, फ्लैट, ऑफिस या किसी भी शुभ स्थल पर पहुंचकर विधिपूर्वक पूजा संपन्न कराते हैं।',
        },
        {
          id: 'faq-5',
          question: 'बुकिंग की पुष्टि कैसे होती है?',
          answer: 'फॉर्म भरने के तुरंत बाद आपको डिजिटल पुष्टि और ईमेल प्राप्त होता है, तथा 30 मिनट के भीतर हमारे आचार्य कॉल द्वारा मुहूर्त की पुष्टि करते हैं।',
        },
        {
          id: 'faq-6',
          question: 'क्या पूजा सामग्री पैकेज में शामिल होती है?',
          answer: 'जी हां, हमारे पैकेज में शुद्ध देसी घी, गंगाजल, नवग्रह समिधा, कलश और हवन सामग्री शामिल रहती है। केवल ताजे फल और फूल स्थानीय स्तर पर रखने होते हैं।',
        },
        {
          id: 'faq-7',
          question: 'शुभ मुहूर्त का निर्धारण कैसे किया जाता है?',
          answer: 'हमारे ज्योतिष आचार्य पंचांग, तिथि, नक्षत्र और यजमान की राशि के अनुसार सर्वोत्तम शुभ मुहूर्त निकालते हैं।',
        },
      ],
    },
    contact: {
      badge: 'सीधा संपर्क सहायता',
      title: 'पंडित जी से संपर्क करें',
      subheading: 'डायरेक्ट कॉल एवं व्हाट्सएप सहायता',
      desc: 'पूजा बुकिंग, शुभ मुहूर्त परामर्श या सामग्री की जानकारी के लिए सीधे फोन, व्हाट्सएप या ईमेल से संपर्क करें।',
      callLabel: 'पंडित जी को कॉल करें',
      callSub: 'सीधे कॉल करने के लिए क्लिक करें (24x7)',
      whatsappLabel: 'व्हाट्सएप करें',
      whatsappValue: 'व्हाट्सएप पर चैट करने के लिए क्लिक करें',
      emailLabel: 'ईमेल भेजें',
      emailSub: '001stiwari9589@gmail.com',
      gmailBtn: 'Gmail में खोलें',
      formTitle: 'त्वरित संपर्क संदेश',
      formSubtitle: 'अपना विवरण भेजें, हम शीघ्र ही आपसे संपर्क करेंगे।',
      nameLabel: 'आपका नाम *',
      namePh: 'अपना पूरा नाम दर्ज करें',
      phoneLabel: 'फोन नंबर *',
      phonePh: '10 अंकों का मोबाइल नंबर दर्ज करें',
      emailInputLabel: 'ईमेल पता *',
      emailPh: 'अपना ईमेल पता दर्ज करें',
      messageLabel: 'आपका संदेश *',
      messagePh: 'अपना पूजा प्रश्न या पसंदीदा तिथि लिखें',
      sendBtn: 'संदेश भेजें',
      sendingBtn: 'भेजा जा रहा है...',
      sentTitle: 'संदेश सफलतापूर्वक भेजा गया',
      sentDesc: 'हमारे समन्वयक शीघ्र ही आपसे संपर्क करेंगे।',
    },
    footer: {
      shloka: 'सभी प्राणी सुखी रहें, सभी रोगमुक्त रहें, सभी मंगलमय घटनाओं के साक्षी बनें और कोई भी दुःख का भागी न बने।',
      shlokaMeaning: 'शांति और सद्भाव का शाश्वत वैदिक आशीर्वाद',
      bio: 'पूर्ण भक्ति और वैदिक शुद्धता के साथ आपके घर पर प्रामाणिक वैदिक अनुष्ठान और गुरुकुल-प्रशिक्षित पंडित सेवा।',
      quickNav: 'त्वरित नेविगेशन',
      sacredCeremonies: 'प्रमुख वैदिक पूजाएं',
      vedicHelpline: 'वैदिक हेल्पलाइन',
      home: 'होम',
      catalog: 'हमारी सेवाएं',
      about: 'हमारे बारे में',
      bookNow: 'पूजा बुक करें',
      faqs: 'सामान्य प्रश्न',
      contact: 'संपर्क करें',
    },
  },
};

export function LanguageProvider({ children }) {
  // Default language is English ('en') and persists across page refreshes
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('divine_vedic_lang');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('divine_vedic_lang', language);
    } catch {
      // ignore storage errors
    }
    document.documentElement.lang = language;
  }, [language]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
