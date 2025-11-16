import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-cta-title">
          Ready to Start Your Project?
        </h2>
  <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8" data-testid="text-cta-subtitle">
          Let's collaborate to bring your vision to life. Our team is ready to help you 
          build exceptional digital experiences that drive results.
        </p>
        <div className="h-px w-48 mx-auto mt-8 mb-12 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button size="lg" className="gap-2 rounded-full px-8 relative group" data-testid="button-cta-contact">
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center"
                >
                  Get Started Today
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </motion.span>
              </Button>
            </motion.div>
          </Link>
          <Link href="/services">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="glow-border rounded-full"
            >
              <Button size="lg" variant="outline" className="gap-2 rounded-full px-8 relative group" data-testid="button-cta-services">
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center"
                >
                  View Our Services
                </motion.span>
              </Button>
              <div className="glow-inner" />
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
