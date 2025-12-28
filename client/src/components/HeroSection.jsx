
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeScene from "./ThreeScene";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [heroConfig, setHeroConfig] = useState({
    badge: "Trusted by Businesses Worldwide",
    title1: "Transform Your Digital",
    title2: "Presence Today",
    desc: "Kodekernel delivers cutting-edge web design and development solutions that drive results. Partner with us to build exceptional digital experiences.",
    stats: [
      { value: "10+", label: "Happy Clients" },
      { value: "20+", label: "Projects Completed" },
      { value: "99%", label: "Client Satisfaction" },
      { value: "24/7", label: "Support Available" }
    ]
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/config")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const badge = data.find(c => c.configKey === "hero_badge")?.configValue;
        const title1 = data.find(c => c.configKey === "hero_title1")?.configValue;
        const title2 = data.find(c => c.configKey === "hero_title2")?.configValue;
        const desc = data.find(c => c.configKey === "hero_desc")?.configValue;
        const statsJson = data.find(c => c.configKey === "hero_stats")?.configValue;

        let stats = heroConfig.stats;
        if (statsJson) { try { stats = JSON.parse(statsJson); } catch (e) { } }

        setHeroConfig(prev => ({
          ...prev,
          badge: badge || prev.badge,
          title1: title1 || prev.title1,
          title2: title2 || prev.title2,
          desc: desc || prev.desc,
          stats: stats
        }));
      })
      .catch(e => console.error(e));

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="absolute inset-0 overflow-hidden">
        {/* 3D scene mounted behind hero content */}
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <ThreeScene className="w-full h-full" />
        </div>
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0005})` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{
            animationDelay: '1s',
            transform: `translateY(${scrollY * -0.2}px) scale(${1 + scrollY * 0.0003})`
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{
            animationDelay: '2s',
            transform: `translate(-50%, -50%) rotate(${scrollY * 0.1}deg)`
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center transition-all duration-700"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          opacity: Math.max(0, 1 - scrollY * 0.002),
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm font-medium" data-testid="text-badge">{heroConfig.badge}</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight" data-testid="text-hero-title">
          {heroConfig.title1}
          <br />
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            {heroConfig.title2}
          </span>
        </h1>

        <p className="text-xs md:text-sm text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed" data-testid="text-hero-subtitle">
          {heroConfig.desc}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button size="lg" className="gap-2 rounded-full px-8 relative group overflow-hidden" data-testid="button-get-started">
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center"
                >
                  Get Started
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
              className="glow-border rounded-full" s
            >
              <Button size="lg" variant="outline" className="gap-2 rounded-full px-8 backdrop-blur relative group" data-testid="button-view-work">
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center"
                >
                  <Play className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                  View Our Work
                </motion.span>
              </Button>
              <div className="glow-inner" />
            </motion.div>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {heroConfig.stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2" data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
