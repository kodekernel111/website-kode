import { Code, Palette, Smartphone, Rocket, Search, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "Custom web applications built with modern technologies and best practices for optimal performance.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that delight users and drive engagement across all devices.",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications that deliver seamless experiences.",
  },
  {
    icon: Rocket,
    title: "SaaS Solutions",
    description: "Scalable software-as-a-service platforms designed to grow with your business.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Data-driven strategies to improve your search rankings and drive organic traffic.",
  },
  {
    icon: BarChart,
    title: "Analytics & Insights",
    description: "Track, measure, and optimize your digital presence with comprehensive analytics.",
  },
];

export default function ServicesGrid() {
  const cardVariants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0 },
    hover: { scale: 1.03, rotate: 0.5 },
  };
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-services-title">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-subtitle">
            We deliver end-to-end digital solutions tailored to your business needs.
          </p>
          <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial="initial"
              whileInView="enter"
              whileHover="hover"
              variants={cardVariants}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            >
              <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1} className="group">
                <Card
                  className="glow-border relative overflow-hidden transition-all duration-300 rounded-2xl border-transparent hover:shadow-2xl p-8 hover-elevate active-elevate-2"
                  data-testid={`card-service-${index}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="w-6 h-6 text-primary" data-testid={`icon-service-${index}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" data-testid={`text-service-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-service-description-${index}`}>
                    {service.description}
                  </p>
                  <div className="glow-inner" />
                </Card>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
