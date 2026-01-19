import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Lightbulb,
    PenTool,
    Code2,
    Rocket,
    Zap,
    Layout,
    Cpu,
    Globe
} from "lucide-react";

// Visual components to fill empty spaces
const StepVisual = ({ type }) => {
    if (type === 'discovery') {
        return (
            <div className="relative w-full h-32 md:h-64 rounded-xl overflow-hidden border border-white/5 bg-black/20 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,transparent,black)]" />
                <div className="relative grid grid-cols-2 gap-2 w-full max-w-[200px] opacity-70 scale-75 md:scale-100">
                    <div className="h-16 bg-[#2a9d8f]/20 rounded-lg border border-[#2a9d8f]/30 animate-pulse" />
                    <div className="h-16 bg-purple-500/20 rounded-lg border border-purple-500/30" />
                    <div className="col-span-2 h-8 bg-blue-500/20 rounded-lg border border-blue-500/30" />
                </div>
            </div>
        );
    }
    if (type === 'design') {
        return (
            <div className="relative w-full h-32 md:h-64 rounded-xl overflow-hidden border border-white/5 bg-black/20 flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-purple-500/20 rounded-full blur-2xl" />
                <div className="relative z-10 flex gap-4 scale-75 md:scale-100">
                    <div className="w-16 h-24 bg-card border border-border rounded-lg shadow-xl translate-y-4 rotate-[-6deg]" />
                    <div className="w-16 h-24 bg-card border border-primary/50  rounded-lg shadow-2xl z-10" />
                    <div className="w-16 h-24 bg-card border border-border rounded-lg shadow-xl translate-y-4 rotate-[6deg]" />
                </div>
            </div>
        );
    }
    if (type === 'dev') {
        return (
            <div className="relative w-full h-32 md:h-64 rounded-xl overflow-hidden border border-white/5 bg-black/20 flex items-center justify-center font-mono text-[10px] md:text-xs text-blue-400">
                <div className="w-4/5 p-4 bg-black/40 rounded border border-white/10 scale-90 md:scale-100 origin-center">
                    <p><span className="text-purple-400">const</span> velocity = <span className="text-yellow-400">true</span>;</p>
                    <p><span className="text-purple-400">await</span> deploy(<span className="text-green-400">"production"</span>);</p>
                    <div className="mt-2 text-gray-500">// 🚀 Launching...</div>
                </div>
            </div>
        );
    }
    return (
        <div className="relative w-full h-32 md:h-64 rounded-xl overflow-hidden border border-white/5 bg-black/20 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-24 h-24 md:w-32 md:h-32 text-indigo-500/20 animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="z-10 bg-card/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 shadow-xl scale-90 md:scale-100">
                <span className="text-green-400">●</span> Live
            </div>
        </div>
    );
};

const SubNode = ({ label, delay, color }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.4 }}
        viewport={{ once: true }}
        className="flex items-center gap-1.5 md:gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg shadow-sm text-[10px] md:text-xs font-medium text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
    >
        <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${color}`} />
        {label}
    </motion.div>
);

const ProcessNode = ({ step, index, isLeft }) => {
    // Mobile: Always left aligned text, but visuals stacked.
    // Desktop: Alternating.
    const alignClass = isLeft ? 'md:flex-row-reverse' : '';
    const textAlign = isLeft ? 'md:text-right items-start md:items-end' : 'md:text-left items-start';
    const branchJustify = isLeft ? 'justify-start md:justify-end' : 'justify-start';

    return (
        <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 relative ${alignClass}`}>

            {/* Content Side */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className={`flex-1 w-full flex flex-col ${textAlign}`}
            >
                <div className="group relative w-full max-w-xl mx-auto md:mx-0">
                    {/* Glowing Border Gradient */}
                    <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${step.gradient} opacity-50 group-hover:opacity-100 blur-sm transition-opacity duration-500`} />

                    <div className="relative h-full bg-[#0a0a0a] border border-white/10 p-5 md:p-8 rounded-2xl overflow-hidden">
                        {/* Background Mesh */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />

                        <div className={`relative flex flex-col gap-3 md:gap-4 ${isLeft ? 'items-start md:items-end' : 'items-start'}`}>
                            <div className={`p-2.5 md:p-3 rounded-xl bg-white/5 border border-white/10 w-fit text-white mb-1 md:mb-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                <step.icon size={22} className={`md:w-6 md:h-6 ${step.iconColor}`} />
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white text-left md:text-inherit">
                                {step.title}
                            </h3>

                            <p className="text-muted-foreground leading-relaxed text-xs md:text-base text-left md:text-inherit">
                                {step.desc}
                            </p>

                            <div className={`flex flex-wrap gap-2 mt-2 md:mt-4 ${branchJustify}`}>
                                {step.branches.map((branch, i) => (
                                    <SubNode
                                        key={i}
                                        label={branch}
                                        delay={0.2 + (i * 0.1)}
                                        color={step.dotColor}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Center Line Container via CSS on Mobile - Hidden here, but we use the main track.
          Actually, we need the DOT to be visible.
      */}
            <div className="relative flex flex-col items-center z-10 shrink-0 h-8 md:h-full justify-center md:justify-center my-2 md:my-0">
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-[#050505] shadow-[0_0_0_2px_rgba(255,255,255,0.05)] md:shadow-[0_0_0_4px_rgba(255,255,255,0.05)] flex items-center justify-center bg-gradient-to-br ${step.gradient}`}>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse" />
                </div>
            </div>

            {/* Visual Side (Fills empty space) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`flex-1 w-full block`}
            >
                <StepVisual type={step.visualType} />
            </motion.div>
        </div>
    );
};

export default function ProcessSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const steps = [
        {
            icon: Lightbulb,
            title: "Discovery & Blueprint",
            desc: "Deep-dive sessions to decode your vision. We architect a scalable foundation and roadmap.",
            branches: ["Market Analysis", "Tech Stack Strategy", "Scope Definition"],
            gradient: "from-[#2a9d8f] to-emerald-500",
            iconColor: "text-[#2a9d8f]",
            dotColor: "bg-[#2a9d8f]",
            visualType: "discovery"
        },
        {
            icon: PenTool,
            title: "Interactive Design",
            desc: "Crafting intuitive interfaces that users love. We prioritize UX patterns that convert.",
            branches: ["Wireframing", "UI Prototyping", "Design System"],
            gradient: "from-purple-500 to-pink-500",
            iconColor: "text-purple-400",
            dotColor: "bg-purple-500",
            visualType: "design"
        },
        {
            icon: Code2,
            title: "Agile Development",
            desc: "Rapid iteration cycles with production-grade code. Secure, fast, and built to scale.",
            branches: ["Frontend Engine", "Secure Backend", "API Integration"],
            gradient: "from-blue-500 to-cyan-400",
            iconColor: "text-blue-400",
            dotColor: "bg-blue-500",
            visualType: "dev"
        },
        {
            icon: Rocket,
            title: "Launch & Growth",
            desc: "Smooth deployment to the cloud. We stand by you as you acquire your first thousand users.",
            branches: ["Cloud Deployment", "Analytics Setup", "SEO Optimization"],
            gradient: "from-orange-500 to-yellow-500",
            iconColor: "text-orange-400",
            dotColor: "bg-orange-500",
            visualType: "launch"
        }
    ];

    return (
        <section ref={containerRef} className="py-20 lg:py-32 bg-[#050505] relative overflow-hidden">
            {/* Cosmic Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                            Built for Velocity
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            A systematic approach that turns complex strategies into elegant, revenue-generating software.
                        </p>
                        <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
                    </motion.div>
                </div>

                <div className="relative">
                    {/* Connecting Line (Track) */}
                    <div className="absolute left-[50%] top-4 bottom-4 w-[2px] bg-white/5 -translate-x-1/2 block" />

                    {/* Active Liquid Line */}
                    <motion.div
                        className="absolute left-[50%] top-4 w-[2px] bg-gradient-to-b from-[#2a9d8f] via-blue-500 to-purple-500 -translate-x-1/2 block origin-top shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                        style={{
                            height: "calc(100% - 2rem)",
                            scaleY: scrollYProgress,
                        }}
                    />

                    <div className="space-y-16 md:space-y-32 pb-8">
                        {steps.map((step, index) => (
                            <ProcessNode
                                key={index}
                                step={step}
                                index={index}
                                isLeft={index % 2 === 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
