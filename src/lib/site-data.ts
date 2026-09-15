export const SITE = {
  name: "US Visa Consultant",
  tagline: "Your Trusted Worldwide Visa Assistance Partner",
  email: "hello@usvisaconsultant.com",
  phone: "+92 312 4541361",
  whatsapp: "+92 312 4541361",
  address: "Office #G 29, City Star Shopping Mall, opposite Model Town link road, Lahore",
  hours: "Mon – Sat · 9:00 AM – 7:00 PM",
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "Destinations", href: "#destinations" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const HERO_STATS = [
  { value: 15, suffix: "+", label: "Years Of Experience" },
  { value: 98, suffix: "%", label: "Happy Customers" },
  { value: 99, suffix: "%", label: "Customer Satisfaction" },
  { value: 40, suffix: "+", label: "Countries Covered" },
];

export const SERVICES = [
  {
    id: "visit",
    number: "01",
    title: "Visit Visa Services",
    short: "Visit Visa",
    description:
      "Hassle-free travel to your dream destination — handled with care, precision and a flawless file that speaks for itself.",
    points: ["Tourist & business visits", "Complete file preparation", "Interview preparation", "Travel itinerary planning"],
    icon: "plane",
    processing: "7–21 days",
  },
  {
    id: "student",
    number: "02",
    title: "Student Visa Guidance",
    short: "Student Visa",
    description:
      "Comprehensive support for student visa applications globally — from university shortlisting to your first day on campus.",
    points: ["University & course selection", "SOP & documentation", "Financial guidance", "Pre-departure briefing"],
    icon: "graduation",
    processing: "4–12 weeks",
  },
  {
    id: "family",
    number: "03",
    title: "Family Visa Services",
    short: "Family Visa",
    description:
      "Helping families reunite with visa solutions that keep your loved ones close, wherever in the world they are.",
    points: ["Spouse & dependent visas", "Sponsorship guidance", "Relationship documentation", "Appeals & refusals"],
    icon: "heart",
    processing: "3–9 months",
  },
  {
    id: "work",
    number: "04",
    title: "Work Visa Assistance",
    short: "Work Visa",
    description:
      "Skilled-worker routes, sponsorship licenses and employment visas — we position you for approval the first time.",
    points: ["Job-market guidance", "Employer sponsorship", "Points-based assessment", "Dependent add-ons"],
    icon: "briefcase",
    processing: "2–12 weeks",
  },
  {
    id: "documents",
    number: "05",
    title: "Document Preparation",
    short: "Documentation",
    description:
      "Every stamp, statement and sponsorship letter verified and formatted to embassy standards before submission.",
    points: ["Bank statements & affidavits", "Translations & attestation", "Cover letters", "Appointment booking"],
    icon: "file",
    processing: "2–5 days",
  },
  {
    id: "interview",
    number: "06",
    title: "Interview Coaching",
    short: "Interview Prep",
    description:
      "One-on-one mock interviews with former embassy-facing consultants so you walk in confident and walk out approved.",
    points: ["Mock interview sessions", "Answer frameworks", "Body-language coaching", "Case-specific prep"],
    icon: "message",
    processing: "1–3 days",
  },
];

export const DESTINATIONS = [
  {
    id: "usa",
    country: "United States",
    city: "New York",
    image: "/images/dest-newyork.png",
    visas: ["Visit", "Student", "Work"],
    success: "96%",
    time: "2–8 weeks",
    tag: "Most Popular",
  },
  {
    id: "uk",
    country: "United Kingdom",
    city: "London",
    image: "/images/dest-london.png",
    visas: ["Visit", "Student", "Family"],
    success: "97%",
    time: "3 weeks",
    tag: "High Approval",
  },
  {
    id: "uae",
    country: "United Arab Emirates",
    city: "Dubai",
    image: "/images/dest-dubai.png",
    visas: ["Visit", "Work", "Investor"],
    success: "99%",
    time: "3–7 days",
    tag: "Fastest",
  },
  {
    id: "canada",
    country: "Canada",
    city: "Toronto",
    image: "/images/dest-toronto.png",
    visas: ["Express Entry", "Student", "Visit"],
    success: "94%",
    time: "4–16 weeks",
    tag: "PR Pathway",
  },
  {
    id: "australia",
    country: "Australia",
    city: "Sydney",
    image: "/images/dest-sydney.png",
    visas: ["Student", "Visit", "Skilled"],
    success: "95%",
    time: "4–12 weeks",
    tag: "Study Hub",
  },
  {
    id: "schengen",
    country: "Schengen Europe",
    city: "Paris",
    image: "/images/dest-schengen.png",
    visas: ["Tourist", "Business", "Family"],
    success: "93%",
    time: "2–4 weeks",
    tag: "27 Countries",
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Free Consultation",
    description:
      "Tell us your travel dream. We assess your profile, eligibility and the best visa route — no cost, no obligation.",
    icon: "phone",
    duration: "Day 1",
  },
  {
    step: "02",
    title: "Documentation",
    description:
      "We build a bullet-proof file: financials, travel history, sponsorships and every embassy requirement checked twice.",
    icon: "file",
    duration: "Week 1–2",
  },
  {
    step: "03",
    title: "Application & Interview",
    description:
      "We submit your application, book appointments and coach you through biometrics and consular interviews.",
    icon: "stamp",
    duration: "Week 2–4",
  },
  {
    step: "04",
    title: "Visa Approved",
    description:
      "Passport in hand, bags packed. We brief you on entry, insurance and everything after you land. Bon voyage!",
    icon: "check",
    duration: "Fly ✈",
  },
];

export const TESTIMONIALS = [
  {
    name: "Moin Sultan",
    location: "Okara, Punjab, Pakistan",
    service: "Visit Visa · USA",
    quote:
      "US Visa Consultant made my visa application process so easy. Their team was professional, friendly, and very responsive to all my queries.",
    rating: 5,
    initials: "MS",
  },
  {
    name: "Benish Zulfiqar",
    location: "Lahore, Punjab, Pakistan",
    service: "Student Visa · UK",
    quote:
      "I couldn't have asked for better service. They guided me every step of the way, and I received my visa without any issues!",
    rating: 5,
    initials: "BZ",
  },
  {
    name: "Ahmed Raza",
    location: "Karachi, Pakistan",
    service: "Work Visa · UAE",
    quote:
      "From document checklist to the final stamp — everything was handled with total professionalism. My Dubai work visa arrived in just five days.",
    rating: 5,
    initials: "AR",
  },
  {
    name: "Fatima Khan",
    location: "Islamabad, Pakistan",
    service: "Family Visa · Canada",
    quote:
      "After one heartbreaking refusal elsewhere, their team rebuilt my case from zero. My husband and I are finally together in Toronto. Forever grateful.",
    rating: 5,
    initials: "FK",
  },
];

export const FAQS = [
  {
    q: "How do I know which visa category is right for me?",
    a: "Start with our free consultation. We review your purpose of travel, profile strength and timeline, then recommend the route with your highest realistic approval probability — visit, student, family, work or investment.",
  },
  {
    q: "What are my chances of approval?",
    a: "We only take cases we believe in. After assessing your documents and history we give you an honest, data-backed estimate based on thousands of applications and current embassy trends.",
  },
  {
    q: "How long does the process take?",
    a: "It depends on the destination and visa type — UAE visit visas can clear in days, while student and family visas typically take 4–16 weeks. We give you a realistic timeline at the start and keep you updated at every milestone.",
  },
  {
    q: "What if my visa was refused before?",
    a: "Refusals are our specialty. We analyse the refusal letter line by line, fix the weaknesses in your case, and rebuild a stronger application — many of our happiest clients came to us after a refusal.",
  },
  {
    q: "Do you help after the visa is approved?",
    a: "Yes. Pre-departure briefings, insurance, ticketing, accommodation guidance and even post-arrival check-ins for students — we stay with you until you're settled.",
  },
  {
    q: "Which countries do you cover?",
    a: "Worldwide. Our highest volumes are the USA, UK, Canada, Australia, Schengen Europe, UAE and Saudi Arabia, but we process applications for 40+ countries across every continent.",
  },
];

export const TRUST_BADGES = [
  "ICCRC Registered Partners",
  "Licensed Immigration Advisors",
  "Embassy-Standard Documentation",
  "98% Client Satisfaction",
];

export const CONTACT_CHANNELS = [
  { icon: "mail", label: "Email Us", value: "hello@usvisaconsultant.com", href: "mailto:hello@usvisaconsultant.com" },
  { icon: "phone", label: "Call / WhatsApp", value: "+92 312 4541361", href: "tel:+923124541361" },
  { icon: "map", label: "Visit Office", value: "Office #G 29, City Star Shopping Mall, Model Town link road, Lahore", href: "#contact" },
  { icon: "clock", label: "Working Hours", value: "Mon – Sat · 9 AM – 7 PM", href: "#contact" },
];

