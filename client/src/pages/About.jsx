import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target, Eye, Award, Users } from "lucide-react";

const team = [
  { name: "Alex Thompson", role: "CEO & Founder", initials: "AT" },
  { name: "Sarah Chen", role: "Head of Design", initials: "SC" },
  { name: "Michael Rodriguez", role: "Lead Developer", initials: "MR" },
  { name: "Emily Parker", role: "Project Manager", initials: "EP" },
];

const values = [
  {
    icon: Target,
    title: "Innovation First",
    description: "We stay ahead of the curve by embracing cutting-edge technologies and methodologies.",
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description: "Every project is crafted with meticulous attention to detail and rigorous quality standards.",
  },
  {
    icon: Users,
    title: "Client Success",
    description: "Your success is our success. We partner with you to achieve your business goals.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Open communication and honest collaboration throughout every project phase.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-about-title">
              About Kodekernel
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-about-subtitle">
              We're a team of passionate developers and designers committed to delivering 
              exceptional web solutions that drive business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <AnimatedSection>
              <Card className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4" data-testid="text-mission-title">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-mission-content">
                  To empower businesses of all sizes with world-class web solutions that combine 
                  beautiful design, robust functionality, and measurable results. We believe in 
                  creating digital experiences that not only look great but drive real business value.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <Card className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4" data-testid="text-vision-title">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-vision-content">
                  To become the most trusted partner for businesses seeking digital transformation. 
                  We envision a future where technology seamlessly connects businesses with their 
                  customers, creating meaningful interactions and lasting relationships.
                </p>
              </Card>
            </AnimatedSection>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12" data-testid="text-values-title">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6 text-center" data-testid={`card-value-${index}`}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2" data-testid={`text-value-title-${index}`}>
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-value-description-${index}`}>
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12" data-testid="text-team-title">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="p-6 text-center hover-elevate active-elevate-2 transition-all duration-300" data-testid={`card-team-${index}`}>
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1" data-testid={`text-team-name-${index}`}>
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-team-role-${index}`}>
                    {member.role}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
