import type { Metadata, Viewport } from "next";
import { Sora, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FAQS, SITE, SERVICES } from "@/lib/site-data";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://usvisaconsultantpvtltd.com"),
  title: "US Visa Consultant | Your Trusted Worldwide Visa Assistance Partner",
  description:
    "Expert guidance for all your visa needs — visit visas, student visas, family visas and more. A smooth, successful application process tailored just for you, anywhere in the world.",
  keywords: [
    "visa consultant",
    "visit visa",
    "student visa",
    "family visa",
    "work visa",
    "worldwide visa consultancy",
    "US Visa Consultant",
    "visa consultant Lahore",
    "visa consultant Pakistan",
  ],
  authors: [{ name: "US Visa Consultant" }],
  icons: {
    icon: "/logo-192.png",
    apple: "/logo-192.png",
  },
  openGraph: {
    title: "US Visa Consultant | Worldwide Visa Assistance",
    description:
      "Expert guidance for all your visa needs, ensuring a smooth and successful application process tailored just for you.",
    siteName: "US Visa Consultant",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/hero-plane-flyby-poster.jpg", width: 1280, height: 720, alt: "US Visa Consultant — Airliner climbing into a clear blue sky" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "US Visa Consultant | Worldwide Visa Assistance",
    description: "Expert guidance for every visa journey — visit, study, work or family, across 40+ countries.",
    images: ["/images/hero-plane-flyby-poster.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f9fd",
  width: "device-width",
  initialScale: 1,
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE.name,
  description:
    "Expert guidance for all your visa needs — visit, study, work and family visas across 40+ countries.",
  url: "https://usvisaconsultantpvtltd.com",
  telephone: SITE.phone,
  email: SITE.email,
  image: "https://usvisaconsultantpvtltd.com/images/hero-plane-flyby-poster.jpg",
  logo: "https://usvisaconsultantpvtltd.com/logo.png",
  priceRange: "$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office #G 29, City Star Shopping Mall, Model Town Link Road",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  makesOffer: SERVICES.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.title, description: s.description },
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
