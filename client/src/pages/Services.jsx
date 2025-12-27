import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import CTASection from "@/components/CTASection";
import { Card } from "@/components/ui/card";
import { Code, Palette, Smartphone, Rocket, Search, BarChart, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "We build fast, scalable, and secure web applications using cutting-edge technologies like React, Next.js, and Node.js.",
    features: ["Custom Web Applications", "Progressive Web Apps", "API Development", "E-Commerce Solutions"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-cyan-500"
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Our design team creates beautiful, intuitive interfaces that users love, focusing on user research and visual storytelling.",
    features: ["User Research & Testing", "Wireframing & Prototyping", "Visual Design Systems", "Responsive Design"],
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-pink-500"
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications that deliver seamless experiences on iOS and Android devices.",
    features: ["iOS App Development", "Android App Development", "Cross-Platform Solutions", "App Store Optimization"],
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-500"
  },
  {
    icon: Rocket,
    title: "SaaS Solutions",
    description: "End-to-end SaaS platform development with subscription management, analytics, and scalable architecture.",
    features: ["Multi-Tenant Architecture", "Payment Integration", "User Management", "Analytics Dashboard"],
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-emerald-500"
  },
  {
    icon: Search,
    title: "SEO & Marketing",
    description: "Comprehensive SEO strategies to improve your search rankings and drive organic traffic to your business.",
    features: ["Technical SEO Audit", "Content Strategy", "Link Building", "Performance Monitoring"],
    gradient: "from-yellow-500/20 to-amber-500/20",
    iconColor: "text-yellow-500"
  },
  {
    icon: BarChart,
    title: "Analytics & Insights",
    description: "Data-driven decision making with custom analytics solutions to track and optimize your digital presence.",
    features: ["Custom Analytics", "Conversion Tracking", "A/B Testing", "Performance Reports"],
    gradient: "from-indigo-500/20 to-violet-500/20",
    iconColor: "text-indigo-500"
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <Navigation />

      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <section className="pt-32 pb-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-services-page-title">
              Our Services
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-services-page-subtitle">
              Comprehensive digital solutions tailored to your business needs.
              From strategy to execution, we've got you covered.
            </p>
            <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="group h-full">
                  <div className={`glow-border h-full relative overflow-hidden rounded-3xl bg-card border border-border/50 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-transparent`}>
                    <div className="glow-inner" />

                    {/* Hover Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative p-8 flex flex-col h-full">
                      {/* Icon */}
                      <div className="mb-6 inline-flex items-center justify-center">
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300`}>
                          <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-foreground transition-colors" data-testid={`text-service-title-${index}`}>
                        {service.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-grow">
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-3 mb-8">
                        {service.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-3 text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
                            <CheckCircle2 className={`w-4 h-4 ${service.iconColor} opacity-70`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action */}
                      <div className="pt-6 border-t border-border/10">
                        <Link href="/contact">
                          <Button variant="ghost" className="w-full justify-between group/btn hover:bg-white/5">
                            <span className="font-medium">Get Started</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Guarantee Section */}
          <AnimatedSection delay={400}>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-background via-card to-background border border-primary/20 p-8 lg:p-12 text-center lg:text-left">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                    Our Quality Guarantee
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every project comes with our comprehensive quality guarantee. We offer ongoing support,
                    performance monitoring, and regular updates to ensure your digital products continue to
                    deliver exceptional results.
                  </p>
                </div>
                <Link href="/pricing">
                  <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all rounded-full font-medium">
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </section>

      <AnimatedSection>
        <PortfolioShowcase />
      </AnimatedSection>
      <AnimatedSection>
        <CTASection />
      </AnimatedSection>
      <Footer />
      <Chatbot />
    </div>
  );
}
