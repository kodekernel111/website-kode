import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";
import PricingCards from "@/components/PricingCards";
import CTASection from "@/components/CTASection";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const features = [
  "Custom Design Tailored to Your Brand",
  "Responsive Mobile-First Development",
  "SEO Optimization Built-In",
  "Fast Loading Performance",
  "Secure & Reliable Hosting",
  "Regular Backups & Updates",
  "Analytics & Reporting",
  "Ongoing Technical Support",
];

export default function Pricing() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-pricing-page-title">
              Pricing Plans
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-pricing-page-subtitle">
              Transparent pricing designed to fit your budget. All plans include our 
              premium support and satisfaction guarantee.
            </p>
            <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
          </div>
        </div>
      </section>

      <AnimatedSection>
        <PricingCards />
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center" data-testid="text-features-title">
              All Plans Include
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3" data-testid={`all-feature-${index}`}>
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection>
        <CTASection />
      </AnimatedSection>
      <Footer />
      <Chatbot />
    </div>
  );
}
