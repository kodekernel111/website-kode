import { Check, Rocket, Flame, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import API_BASE_URL from "../config";

const iconMap = {
    rocket: Rocket,
    flame: Flame,
    gem: Gem
};

const PricingCard = ({ plan, index }) => {
    const isPopular = plan.popular;

    // Handle both string icon names (from JSON) and direct component references (fallback)
    const IconComponent = typeof plan.icon === 'string'
        ? (iconMap[plan.icon.toLowerCase()] || Rocket)
        : Rocket;

    // Icon styling based on plan type (mimicking original colors)
    let iconColorClass = "text-orange-400";
    if (plan.icon === 'flame' || plan.title.includes("Growth")) iconColorClass = "text-red-500";
    if (plan.icon === 'gem' || plan.title.includes("Revenue")) iconColorClass = "text-blue-400";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col h-full rounded-2xl border p-8 transition-all duration-300 ${isPopular
                ? "bg-card/40 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-105 z-10"
                : "bg-card/20 border-white/5 hover:border-white/10"
                }`}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Most Popular
                    </div>
                </div>
            )}

            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <IconComponent className={`w-5 h-5 ${iconColorClass}`} />
                    <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/project</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                </p>
            </div>

            <Button
                className={`w-full mb-8 rounded-lg font-medium transition-all ${isPopular
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}
            >
                Get Started
            </Button>

            <div className="space-y-4 flex-grow">
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default function PricingSection() {
    const [plans, setPlans] = useState([
        {
            title: "Launch Plan",
            price: "$1,800",
            icon: "rocket",
            description: "Build a strong online foundation that starts bringing customers.",
            popular: false,
            features: [
                "For new & local businesses that need a professional presence",
                "Conversion-focused custom website",
                "Mobile-first UX designed to generate calls & messages",
                "5 professionally written pages",
                "Click-to-Call, WhatsApp & Contact forms",
                "Google Maps + Local SEO structure",
                "Speed & performance optimization",
                "Basic SEO setup",
                "1 month post-launch support"
            ]
        },
        {
            title: "Growth Engine",
            price: "$3,200",
            icon: "flame",
            description: "Turn your website into a customer-generating machine. You will get below benefits on top of Launch 🚀 plan.",
            popular: true,
            features: [
                "For growing clinics, restaurants & service businesses",
                "Unlimited pages & landing funnels",
                "CRM integration",
                "Customer re-engagement automation",
                "Multi-location SEO & tracking",
                "Custom business integrations",
                "Review generation automation",
                "Advanced local SEO",
                "Monthly analytics & performance dashboard"
            ]
        },
        {
            title: "Revenue System",
            price: "$5,500",
            icon: "gem",
            description: "Your business, fully automated for scale. You will get the below benefits on top of Growth Engine 🔥 plan.",
            popular: false,
            features: [
                "For premium & multi-location businesses looking for predictable growth",
                "Dedicated account manager",
                "Security & compliance setup",
                "Multi-language support",
                "Revenue dashboards & forecasting tools",
                "Custom API Development",
                "Priority 24/7 Support",
                "A/B Testing & CRO",
                "Full Stack Marketing Setup"
            ]
        }
    ]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/pricing-plans`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const mappedPlans = data.map(plan => ({
                        title: plan.name,
                        price: plan.price,
                        description: plan.description,
                        popular: plan.popular,
                        features: plan.features || [],
                        icon: plan.name.toLowerCase().includes("growth") ? "flame" :
                            plan.name.toLowerCase().includes("revenue") ? "gem" : "rocket"
                    }));

                    // Sort by order if available, otherwise keep backend order
                    // Assuming backend sends sorted, but if needed we can sort here.
                    setPlans(mappedPlans);
                }
            })
            .catch(e => console.error("Failed to fetch pricing plans", e));
    }, []);

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Meshy Background */}
            <div className="absolute inset-0 bg-[#050505]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Choose the perfect plan to accelerate your digital growth. No hidden fees, just results.
                    </p>
                    <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    {plans.map((plan, index) => (
                        <PricingCard key={index} plan={plan} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
