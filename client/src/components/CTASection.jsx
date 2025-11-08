import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-cta-title">
          Ready to Start Your Project?
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed" data-testid="text-cta-subtitle">
          Let's collaborate to bring your vision to life. Our team is ready to help you 
          build exceptional digital experiences that drive results.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <Button size="lg" className="gap-2 rounded-full px-8" data-testid="button-cta-contact">
              Get Started Today
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/services">
            <Button size="lg" variant="outline" className="gap-2 rounded-full px-8" data-testid="button-cta-services">
              View Our Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
