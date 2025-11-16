import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AnimatedSection>
        <ServicesGrid />
      </AnimatedSection>
      <AnimatedSection>
        <PortfolioShowcase />
      </AnimatedSection>
      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>
      <AnimatedSection>
        <CTASection />
      </AnimatedSection>
      <AnimatedSection>
        <FAQSection />
      </AnimatedSection>
      <Footer />
      <Chatbot />
    </div>
  );
}
