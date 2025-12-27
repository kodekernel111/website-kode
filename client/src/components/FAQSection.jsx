import React from "react";

const faqs = [
  {
    q: "What services do you offer?",
    a: "We build custom websites, progressive web apps (PWAs), e-commerce stores, and web-based SaaS applications. We also provide UI/UX design, performance optimization, and ongoing maintenance.",
  },
  {
    q: "How long does a typical project take?",
    a: "Project timelines vary. A small brochure website usually takes 2–4 weeks, a mid-size app 6–12 weeks, and larger SaaS platforms 3+ months. We'll provide a clear schedule after scoping the requirements.",
  },
  {
    q: "What technologies do you use?",
    a: "We commonly use React, Vite, Three.js for interactive 3D, Node/Express for backends, and Tailwind CSS for styling. We pick tools that best fit your product goals.",
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
    q: "What is your process for accessibility and performance?",
    a: "Accessibility and performance are built into our process. We run audits (Lighthouse), provide semantic markup, keyboard navigation, and optimize assets and loading strategies.",
  },
  {
    q: "How do we get started?",
    a: "Start with a short discovery call so we can understand your goals. We'll follow with a proposal that includes scope, timeline, and cost. From there we begin design, then development, testing, and launch.",
  },
];

export default function FAQSection() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 mb-16 bg-gradient-to-br from-card via-background to-muted rounded-2xl shadow-2xl" aria-labelledby="faq-heading">
      <div className="mx-auto text-center mb-10">
        <h2 id="faq-heading" className="text-4xl font-bold text-primary drop-shadow-sm tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
          Answers to common questions about our web & app development services.
        </p>
        <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
      </div>

      <div className="flex flex-col divide-y divide-border">
        {faqs.map((item, idx) => (
          <details
            key={idx}
            className="group py-3 px-2 transition-all duration-300 bg-transparent hover:bg-accent/30 focus-within:bg-accent/40 rounded-lg"
          >
            <summary
              className="flex items-center justify-between cursor-pointer list-none text-base font-semibold text-foreground outline-none select-none transition-colors duration-200 group-open:bg-accent/10 px-2 py-2 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="transition-colors duration-200 pl-5">{item.q}</span>
              <span className="inline-block ml-3 text-primary text-2xl transition-transform duration-300 group-open:rotate-45 group-open:scale-125">
                +
              </span>
            </summary>
            <div className="overflow-hidden transition-all duration-300 max-w-2xl mx-auto">
              <div className="mt-3 text-xs text-muted-foreground leading-relaxed px-2 pb-2 animate-fade-in">
                {item.a}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
