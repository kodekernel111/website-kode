import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What services do you offer?",
    a: "At Kodekernel, we partner with founders to design, build, and launch high-impact digital products. This includes MVP development, scalable web applications, and performance-driven SaaS products. Beyond just building, we help with product strategy, UI/UX design, technical architecture, performance optimization, and long-term maintenance to ensure your product grows with your startup.",
  },
  {
    q: "What are your delivery timelines for an MVP?",
    a: "Our MVP Growth Engine offering is designed for rapid execution, with a 5-week delivery cycle that includes design, engineering, QA, and deployment. For Landing Launch projects, we provide guaranteed delivery within 72 hours. Project timelines are documented in our agreements, and we ensure full transparency throughout development.",
  },
  {
    q: "Can you help non-technical founders?",
    a: "Absolutely. We work closely with non-technical founders and act as your technical partner from day one. We handle everything from product strategy to engineering, while keeping you involved through clear communication and regular updates. Along the way, we also help you understand your product, architecture, and technical decisions — so you always feel in control.",
  },
  {
    q: "Do you provide assistance for fund raising?",
    a: "Yes. Our MVP's clearly communicate your vision, product, and traction. Beyond visuals, we help structure your narrative so your story, metrics, and product potential resonate with investors. Many founders also use the MVPs we build as live proof of execution when pitching.",
  },

  {
    q: "Do you provide hosting and post-launch support?",
    a: "Yes — we can handle hosting, CI/CD, monitoring, and ongoing support plans. We also offer training and documentation so your team can take over if you prefer.",
  },
  {
    q: "How do you handle pricing?",
    a: "We offer fixed-price quotes for well-defined projects and time-and-materials for exploratory work. For ongoing work we provide monthly retainers. We always share a clear scope and milestones upfront.",
  },
  {
    q: "Can you work with our existing design or brand guidelines?",
    a: "Absolutely. We follow your brand system, or we can help refine it. Our goal is to deliver consistent, accessible interfaces that reflect your brand.",
  },

  {
    q: "How do we get started?",
    a: "Start with a short discovery call so we can understand your goals. We'll follow with a proposal that includes scope, timeline, and cost. From there we begin design, then development, testing, and launch.",
  },
];

const FAQItem = ({ item, isOpen, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group border rounded-xl overflow-hidden transition-all duration-300 ${isOpen
        ? "bg-white/[0.03] border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
        : "bg-transparent border-white/5 hover:bg-white/[0.02] hover:border-white/10"
        }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className={`text-base md:text-lg font-medium transition-colors duration-300 ${isOpen ? "text-white" : "text-slate-300 group-hover:text-white"
          }`}>
          {item.q}
        </span>
        <div className={`p-2 rounded-lg border transition-all duration-300 ${isOpen
          ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
          : "bg-white/5 border-white/10 text-slate-400 group-hover:border-white/20"
          }`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-0">
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Meshy Background */}
      <div className="absolute inset-0 bg-[#050505]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent opacity-40" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to know about our services and process.
          </motion.p>
          <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
