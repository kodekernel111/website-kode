import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";

import FAQSection from "@/components/FAQSection";
import PricingSection from "@/components/PricingSection";

import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AnimatedSection>
        <ProcessSection />
      </AnimatedSection>

      <AnimatedSection>
        <PricingSection />
      </AnimatedSection>

      <AnimatedSection>
        <FAQSection />
      </AnimatedSection>
      <Footer />
      <Chatbot />
    </div>
  );
}
