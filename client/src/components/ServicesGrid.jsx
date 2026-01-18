import { useState, useEffect } from "react";
import { Code, Palette, Smartphone, Rocket, Search, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Card } from "@/components/ui/card";
import API_BASE_URL from '../config';

const iconMap = {
  Code, Palette, Smartphone, Rocket, Search, BarChart
};

export default function ServicesGrid() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/services`)
      .then(r => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(e => {
        console.error("Failed to fetch services", e);
        setLoading(false);
        // Fallback to empty
      });
  }, []);

  const cardVariants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0 },
    hover: { scale: 1.03, rotate: 0.5 },
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-white">Loading services...</div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-services-title">
            Our Services
          </h2>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-subtitle">
            We deliver end-to-end digital solutions tailored to your business needs.
          </p>
          <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code;

            return (
              <motion.div
                key={service.id || index}
                initial="initial"
                whileInView="enter"
                whileHover="hover"
                variants={cardVariants}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="h-full"
              >
                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1} className="group h-full">
                  <Card
                    className="glow-border relative overflow-hidden transition-all duration-300 rounded-2xl border-transparent hover:shadow-2xl p-8 hover-elevate active-elevate-2 h-full flex flex-col"
                    data-testid={`card-service-${index}`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                      <Icon className="w-6 h-6 text-primary" data-testid={`icon-service-${index}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3" data-testid={`text-service-title-${index}`}>
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-grow" data-testid={`text-service-description-${index}`}>
                      {service.description}
                    </p>
                    <div className="glow-inner" />
                  </Card>
                </Tilt>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
