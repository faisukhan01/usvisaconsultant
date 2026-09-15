import type { Metadata, Viewport } from "next";
import { Sora, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f9fd",
  width: "device-width",
  initialScale: 1,
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
