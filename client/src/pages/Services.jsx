import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import CTASection from "@/components/CTASection";
import { Card } from "@/components/ui/card";
import { Code, Palette, Smartphone, Rocket, Search, BarChart, Zap, Shield } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "We build fast, scalable, and secure web applications using cutting-edge technologies like React, Next.js, and Node.js. Our solutions are optimized for performance and built to grow with your business.",
    features: ["Custom Web Applications", "Progressive Web Apps", "API Development", "E-Commerce Solutions"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Our design team creates beautiful, intuitive interfaces that users love. We focus on user research, wireframing, prototyping, and visual design to deliver exceptional experiences.",
    features: ["User Research & Testing", "Wireframing & Prototyping", "Visual Design Systems", "Responsive Design"],
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications that deliver seamless experiences on iOS and Android. We use React Native and Flutter to build high-performance apps.",
    features: ["iOS App Development", "Android App Development", "Cross-Platform Solutions", "App Store Optimization"],
  },
  {
    icon: Rocket,
    title: "SaaS Solutions",
    description: "End-to-end SaaS platform development with subscription management, user authentication, analytics, and more. We help you launch and scale your software business.",
    features: ["Multi-Tenant Architecture", "Payment Integration", "User Management", "Analytics Dashboard"],
  },
  {
    icon: Search,
    title: "SEO & Marketing",
    description: "Comprehensive SEO strategies to improve your search rankings and drive organic traffic. We combine technical SEO, content optimization, and link building.",
    features: ["Technical SEO Audit", "Content Strategy", "Link Building", "Performance Monitoring"],
  },
  {
    icon: BarChart,
    title: "Analytics & Insights",
    description: "Data-driven decision making with custom analytics solutions. We help you track, measure, and optimize your digital presence for maximum ROI.",
    features: ["Custom Analytics", "Conversion Tracking", "A/B Testing", "Performance Reports"],
  },
];

export default function Services() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-services-page-title">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-services-page-subtitle">
              Comprehensive digital solutions tailored to your business needs. 
              From strategy to execution, we've got you covered.
            </p>
          </div>

          <div className="space-y-12 mb-20">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                >
                  <Tilt
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    glareEnable={true}
                    glareMaxOpacity={0.06}
                    scale={1}
                    className="group"
                  >
                    <Card
                      className="glow-border relative overflow-hidden transition-all duration-300 rounded-2xl border-transparent hover:shadow-2xl"
                      data-testid={`card-service-detail-${index}`}
                    >
                      <div className="glow-inner" />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    <div>
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4" data-testid={`text-service-detail-title-${index}`}>
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-6" data-testid={`text-service-detail-description-${index}`}>
                        {service.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">What's Included:</h3>
                      <ul className="space-y-3">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3" data-testid={`feature-${index}-${featureIndex}`}>
                            <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </Tilt>
            </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            >
              <Tilt
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                glareEnable={true}
                glareMaxOpacity={0.06}
                scale={1}
                className="group"
              >
                <Card className="glow-border p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-transparent relative overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-300">
                  <div className="glow-inner" />
                  <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" data-testid="text-guarantee-title">
                    Our Quality Guarantee
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-guarantee-content">
                    Every project comes with our comprehensive quality guarantee. We offer ongoing support, 
                    performance monitoring, and regular updates to ensure your digital products continue to 
                    deliver exceptional results. Your satisfaction is our top priority.
                  </p>
                </div>
              </div>
                </Card>
              </Tilt>
            </motion.div>
          </div>
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
