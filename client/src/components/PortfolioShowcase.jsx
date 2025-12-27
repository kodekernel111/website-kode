import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const ecommerceImage = "/generated_images/E-commerce_website_homepage_a23a291a.png";
const saasImage = "/generated_images/SaaS_landing_page_92a46d2f.png";
const portfolioImage = "/generated_images/Portfolio_website_homepage_a3cf9c70.png";
const fintechImage = "/generated_images/Fintech_dashboard_interface_e4b3828c.png";
const restaurantImage = "/generated_images/Restaurant_website_homepage_b80468f7.png";
const techStartupImage = "/generated_images/Tech_startup_landing_page_ae982cab.png";

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
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map(p => p.category)))], []);

  const filtered = projects.filter(p => filter === "All" || p.category === filter);

  const cardVariants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0 },
    hover: { scale: 1.03, rotate: 0.5 },
  };

  return (
    <section className="py-16 lg:py-28 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="text-portfolio-title">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">Expertise</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto" data-testid="text-portfolio-subtitle">
            Explore our latest projects showcasing innovative design and cutting-edge technology.
          </p>
          <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
        </div>

        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === cat ? 'bg-indigo-500 text-white shadow-lg' : 'bg-card-foreground text-muted-foreground hover:brightness-95'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
          {filtered.map((project, index) => (
            <motion.div
              key={index}
              initial="initial"
              whileInView="enter"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
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
                <Card className="glow-border relative overflow-hidden transition-all duration-300 rounded-2xl border-transparent hover:shadow-2xl" data-testid={`card-project-${index}`}>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      fetchpriority="low"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      data-testid={`img-project-${index}`}
                    />

                    {/* neon border / inner glow handled by .glow-border CSS */}
                    <div className="glow-inner" />
                  </div>

                  <div className="p-5">
                    <div className="text-sm text-primary font-medium mb-2" data-testid={`text-project-category-${index}`}>
                      {project.category}
                    </div>
                    <h3
                      className={`font-semibold mb-3 ${[
                        "Luxury E-Commerce Platform",
                        "SaaS Analytics Dashboard",
                        "Creative Portfolio Site",
                        "Fintech Banking App",
                        "Fine Dining Restaurant",
                        "Tech Startup Landing"
                      ].includes(project.title) ? "text-xs lg:text-sm" : "text-sm lg:text-base"}`}
                      data-testid={`text-project-title-${index}`}
                    >
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="transition-shadow duration-200 hover:shadow-[0_0_18px_rgba(99,102,241,0.35)]"
                          data-testid={`badge-tag-${index}-${tagIndex}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
