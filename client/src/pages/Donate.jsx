import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Heart, Zap, Users } from "lucide-react";
import { useState } from "react";

const amounts = [
  { value: 5, label: "$5" },
  { value: 10, label: "$10" },
  { value: 25, label: "$25" },
  { value: 50, label: "$50" },
];

const benefits = [
  {
    icon: Heart,
    title: "Support Our Mission",
    description: "Help us continue creating valuable content and resources for the community.",
  },
  {
    icon: Zap,
    title: "Enable Innovation",
    description: "Your support allows us to experiment with new technologies and share our findings.",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Contribute to a thriving community of developers and designers learning together.",
  },
];

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");

  const handleDonate = () => {
    const amount = customAmount || selectedAmount;
    console.log("Donation amount:", amount);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20 lg:pb-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Coffee className="w-10 h-10 text-primary" data-testid="icon-coffee" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-donate-title">
              Buy Us a Coffee
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-donate-subtitle">
              Love what we do? Support our team and help us continue creating amazing content, 
              tools, and resources for the developer community.
            </p>
          </div>

          <AnimatedSection>
            <Card className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center" data-testid="text-amount-title">
              Choose an Amount
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {amounts.map((amount) => (
                <Button
                  key={amount.value}
                  variant={selectedAmount === amount.value ? "default" : "outline"}
                  size="lg"
                  onClick={() => {
                    setSelectedAmount(amount.value);
                    setCustomAmount("");
                  }}
                  data-testid={`button-amount-${amount.value}`}
                  className="h-16 text-lg"
                >
                  {amount.label}
                </Button>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">
                Or enter a custom amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  className="w-full h-12 pl-8 pr-4 rounded-md border border-input bg-background"
                  data-testid="input-custom-amount"
                />
              </div>
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleDonate}
              data-testid="button-donate-now"
            >
              <Coffee className="w-5 h-5" />
              Donate ${customAmount || selectedAmount}
            </Button>

            <p className="text-sm text-muted-foreground text-center mt-4" data-testid="text-payment-note">
              Secure payment powered by PayPal
            </p>
          </Card>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="p-6 text-center" data-testid={`card-benefit-${index}`}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2" data-testid={`text-benefit-title-${index}`}>
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-benefit-description-${index}`}>
                    {benefit.description}
                  </p>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <Card className="p-8 mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <h3 className="text-xl font-bold mb-4 text-center" data-testid="text-thank-you-title">
              Thank You for Your Support!
            </h3>
            <p className="text-muted-foreground text-center leading-relaxed" data-testid="text-thank-you-message">
              Every contribution, no matter the size, helps us continue our mission to share knowledge 
              and build tools that make a difference. Your generosity is what keeps us going!
            </p>
          </Card>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
