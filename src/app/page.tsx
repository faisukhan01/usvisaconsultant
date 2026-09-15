import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { Process } from "@/components/site/process";
import { Eligibility } from "@/components/site/eligibility";
import { Destinations } from "@/components/site/destinations";
import { Testimonials } from "@/components/site/testimonials";
import { CtaBanner } from "@/components/site/cta-banner";
import { Contact } from "@/components/site/contact";
import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Process />
        <Eligibility />
        <Destinations />
        <Testimonials />
        <CtaBanner />
        <Contact />
        <Faq />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
