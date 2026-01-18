import API_BASE_URL from "../config";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch testimonials", err);
        setLoading(false);
      });
  }, []);

  const cardVariants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0 },
    hover: { scale: 1.03, rotate: 0.5 },
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-card text-center text-white">
        Loading testimonials...
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-testimonials-title">
            What Our Clients Say
          </h2>
          <p className="text-[11px] text-muted-foreground max-w-3xl mx-auto" data-testid="text-testimonials-subtitle">
            Don't just take our word for it. Here's what our satisfied clients have to say about working with us.
          </p>
          <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            const initials = testimonial.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2);

            return (
              <motion.div
                key={testimonial.id || index}
                initial="initial"
                whileInView="enter"
                whileHover="hover"
                variants={cardVariants}
                viewport={{ once: true, amount: 0.2 }}
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
                    className="glow-border relative overflow-hidden transition-all duration-300 rounded-2xl border-transparent hover:shadow-2xl p-8 h-full flex flex-col"
                    data-testid={`card-testimonial-${index}`}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.span
                          key={i}
                          animate={hovered === index ? {
                            scale: [1, 1.3, 1],
                            rotate: [0, 15, -10, 0],
                            transition: { delay: 0.05 * i, duration: 0.6, type: 'spring', stiffness: 300, damping: 18 },
                          } : { scale: 1, rotate: 0 }}
                          className="inline-block"
                        >
                          <Star className="w-4 h-4 fill-primary text-primary drop-shadow" data-testid={`star-${index}-${i}`} />
                        </motion.span>
                      ))}
                    </div>
                    <p className="text-sm italic text-muted-foreground mb-6 leading-relaxed flex-grow" data-testid={`text-testimonial-content-${index}`}>
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm" data-testid={`text-testimonial-name-${index}`}>
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
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
