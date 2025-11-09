import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "wouter";

const plans = [
  {
    name: "Starter",
    price: "$999",
    period: "per project",
    description: "Perfect for small businesses and startups looking to establish their online presence.",
    features: [
      "Custom Website Design",
      "Responsive Mobile Layout",
      "Up to 5 Pages",
      "Basic SEO Optimization",
      "1 Month Support",
      "Contact Form Integration",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$2,499",
    period: "per project",
    description: "Ideal for growing businesses that need advanced features and functionality.",
    features: [
      "Everything in Starter",
      "Up to 15 Pages",
      "Advanced SEO Strategy",
      "CMS Integration",
      "3 Months Support",
      "Analytics Dashboard",
      "Performance Optimization",
      "E-Commerce Ready",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "Tailored solutions for large organizations with complex requirements.",
    features: [
      "Everything in Professional",
      "Unlimited Pages",
      "Custom Integrations",
      "Dedicated Account Manager",
      "Priority Support",
      "Advanced Security",
      "Multi-language Support",
      "Custom Development",
    ],
    popular: false,
  },
];

export default function PricingCards() {
  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-pricing-title">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-pricing-subtitle">
            Choose the plan that fits your needs. All plans include our premium support and quality guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 hover-elevate active-elevate-2 transition-all duration-300 hover:-translate-y-1 border ${
                plan.popular ? "border-primary border-2" : "border-muted hover:border-primary"
              } hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]`}
              data-testid={`card-pricing-${index}`}
            >
              {plan.popular && (
                <Badge className="mb-4" data-testid={`badge-popular-${index}`}>
                  Most Popular
                </Badge>
              )}
              
              <h3 className="text-2xl font-bold mb-2" data-testid={`text-plan-name-${index}`}>
                {plan.name}
              </h3>
              
              <div className="mb-4">
                <span className="text-4xl font-bold" data-testid={`text-plan-price-${index}`}>
                  {plan.price}
                </span>
                <span className="text-muted-foreground ml-2" data-testid={`text-plan-period-${index}`}>
                  {plan.period}
                </span>
              </div>

              <p className="text-muted-foreground mb-6" data-testid={`text-plan-description-${index}`}>
                {plan.description}
              </p>

              <Link href="/contact">
                <Button
                  className="w-full mb-6"
                  variant={plan.popular ? "default" : "outline"}
                  data-testid={`button-plan-select-${index}`}
                >
                  Get Started
                </Button>
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3" data-testid={`feature-${index}-${featureIndex}`}>
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
