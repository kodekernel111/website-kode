import API_BASE_URL from "../config";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "wouter";

export default function PricingCards() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/pricing-plans`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setPlans(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-card min-h-[500px] flex items-center justify-center">
        <div className="text-white">Loading pricing plans...</div>
      </section>
    );
  }

  // If no plans (and not loading), maybe show default message or nothing
  if (plans.length === 0) {
    return (
      <section className="py-20 lg:py-32 bg-card min-h-[500px] flex items-center justify-center">
        <div className="text-white">Pricing plans currently unavailable.</div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-pricing-title">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto" data-testid="text-pricing-subtitle">
            Choose the plan that fits your needs. All plans include our premium support and quality guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.id || index}
              className={`p-8 hover-elevate active-elevate-2 transition-all duration-300 hover:-translate-y-1 border ${plan.popular ? "border-primary border-2" : "border-muted hover:border-primary"
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
                {plan.features && plan.features.map((feature, featureIndex) => (
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
