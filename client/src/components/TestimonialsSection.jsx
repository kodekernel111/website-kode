import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechVentures",
    company: "TechVentures",
    content: "Kodekernel transformed our vision into reality. Their attention to detail and technical expertise is unmatched. Our new platform exceeded all expectations.",
    rating: 5,
    initials: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Founder, StartupHub",
    company: "StartupHub",
    content: "Working with Kodekernel was a game-changer for our business. They delivered a scalable SaaS solution that helped us grow 10x in just 6 months.",
    rating: 5,
    initials: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director, BrandFlow",
    company: "BrandFlow",
    content: "The team at Kodekernel is incredibly talented and professional. They took the time to understand our needs and delivered beyond our expectations.",
    rating: 5,
    initials: "ER",
  },
  {
    name: "David Kim",
    role: "CTO, DataSync",
    company: "DataSync",
    content: "Exceptional quality and lightning-fast delivery. Kodekernel's development team is top-notch. Highly recommend for any serious web project.",
    rating: 5,
    initials: "DK",
  },
  {
    name: "Lisa Anderson",
    role: "Product Manager, InnovateCo",
    company: "InnovateCo",
    content: "Kodekernel's expertise in modern web technologies helped us launch our product ahead of schedule. Their support throughout the process was invaluable.",
    rating: 5,
    initials: "LA",
  },
  {
    name: "James Wilson",
    role: "Director, FinanceHub",
    company: "FinanceHub",
    content: "From design to deployment, Kodekernel handled everything with professionalism. Our new fintech platform is secure, fast, and beautiful.",
    rating: 5,
    initials: "JW",
  },
];

export default function TestimonialsSection() {
  const cardVariants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0 },
    hover: { scale: 1.03, rotate: 0.5 },
  };

  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-testimonials-title">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-testimonials-subtitle">
            Don't just take our word for it. Here's what our satisfied clients have to say about working with us.
          </p>
          <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
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
                  className="glow-border relative overflow-hidden transition-all duration-300 rounded-2xl border-transparent hover:shadow-2xl p-8"
                  data-testid={`card-testimonial-${index}`}
                >
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" data-testid={`star-${index}-${i}`} />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed" data-testid={`text-testimonial-content-${index}`}>
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold" data-testid={`text-testimonial-name-${index}`}>
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
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
