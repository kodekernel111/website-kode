import { Code, Palette, Smartphone, Rocket, Search, BarChart } from "lucide-react";
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
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-services-title">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-subtitle">
            Comprehensive solutions tailored to your needs, from concept to deployment and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-8 hover-elevate active-elevate-2 transition-all duration-300 hover:-translate-y-1"
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
