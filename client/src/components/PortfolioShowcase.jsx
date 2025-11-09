import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ecommerceImage from '@assets/generated_images/E-commerce_website_homepage_a23a291a.png';
import saasImage from '@assets/generated_images/SaaS_landing_page_92a46d2f.png';
import portfolioImage from '@assets/generated_images/Portfolio_website_homepage_a3cf9c70.png';
import fintechImage from '@assets/generated_images/Fintech_dashboard_interface_e4b3828c.png';
import restaurantImage from '@assets/generated_images/Restaurant_website_homepage_b80468f7.png';
import techStartupImage from '@assets/generated_images/Tech_startup_landing_page_ae982cab.png';

const projects = [
  {
    image: ecommerceImage,
    title: "Luxury E-Commerce Platform",
    category: "E-Commerce",
    tags: ["React", "Node.js", "Stripe"],
  },
  {
    image: saasImage,
    title: "SaaS Analytics Dashboard",
    category: "SaaS",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    image: portfolioImage,
    title: "Creative Portfolio Site",
    category: "Portfolio",
    tags: ["React", "Tailwind", "Framer Motion"],
  },
  {
    image: fintechImage,
    title: "Fintech Banking App",
    category: "Fintech",
    tags: ["React", "D3.js", "Express"],
  },
  {
    image: restaurantImage,
    title: "Fine Dining Restaurant",
    category: "Restaurant",
    tags: ["Next.js", "Sanity", "Stripe"],
  },
  {
    image: techStartupImage,
    title: "Tech Startup Landing",
    category: "Startup",
    tags: ["React", "Three.js", "GSAP"],
  },
];

export default function PortfolioShowcase() {
  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-portfolio-title">
            Our Portfolio
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-portfolio-subtitle">
            Explore our latest projects showcasing innovative design and cutting-edge technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 hover:-translate-y-1 group"
              data-testid={`card-project-${index}`}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-testid={`img-project-${index}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <div className="text-sm text-primary font-medium mb-2" data-testid={`text-project-category-${index}`}>
                  {project.category}
                </div>
                <h3 className="text-xl font-semibold mb-4" data-testid={`text-project-title-${index}`}>
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" data-testid={`badge-tag-${index}-${tagIndex}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
