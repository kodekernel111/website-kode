import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Target, Eye, Award, Users } from "lucide-react";

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
  const [team, setTeam] = useState([]);
  const [showTeam, setShowTeam] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/team")
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(data => setTeam(data))
      .catch(e => console.error("Failed to fetch team", e));

    fetch("http://localhost:8080/api/config")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const val = data.find(c => c.configKey === "team_section_enabled")?.configValue;
        setShowTeam(val !== "false");
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background selection:bg-primary/20">
      <Navigation />

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2" />
      </div>

      <section className="pt-32 pb-20 lg:pb-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight" data-testid="text-about-title">
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">Kodekernel</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-about-subtitle">
              We're a team of passionate developers and designers committed to delivering
              exceptional web solutions that drive business growth.
            </p>
            <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
            <AnimatedSection>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Tilt
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  glareEnable={true}
                  glareMaxOpacity={0.1}
                  scale={1.01}
                  className="h-full"
                >
                  <Card className="glow-border p-10 h-full relative overflow-hidden rounded-3xl border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="glow-inner" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center mb-6 shadow-lg shadow-primary/5">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4" data-testid="text-mission-title">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm" data-testid="text-mission-content">
                      To empower businesses of all sizes with world-class web solutions that combine
                      beautiful design, robust functionality, and measurable results. We believe in
                      creating digital experiences that not only look great but drive real business value.
                    </p>
                  </Card>
                </Tilt>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Tilt
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  glareEnable={true}
                  glareMaxOpacity={0.1}
                  scale={1.01}
                  className="h-full"
                >
                  <Card className="glow-border p-10 h-full relative overflow-hidden rounded-3xl border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="glow-inner" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/10 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/5">
                      <Eye className="w-8 h-8 text-purple-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4" data-testid="text-vision-title">Our Vision</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm" data-testid="text-vision-content">
                      To become the most trusted partner for businesses seeking digital transformation.
                      We envision a future where technology seamlessly connects businesses with their
                      customers, creating meaningful interactions and lasting relationships.
                    </p>
                  </Card>
                </Tilt>
              </motion.div>
            </AnimatedSection>
          </div>

          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4" data-testid="text-values-title">
                Our <span className="text-primary">Values</span>
              </h2>
              <div className="h-px w-48 mx-auto mt-6 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Tilt
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    glareEnable={true}
                    glareMaxOpacity={0.05}
                    scale={1.02}
                    className="h-full"
                  >
                    <Card className="glow-border p-8 h-full relative overflow-hidden rounded-3xl border-border/50 bg-card/30 hover:bg-card/50 transition-colors" data-testid={`card-value-${index}`}>
                      <div className="glow-inner" />
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3" data-testid={`text-value-title-${index}`}>
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-value-description-${index}`}>
                        {value.description}
                      </p>
                    </Card>
                  </Tilt>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {team.length > 0 && showTeam && (
            <div>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-5xl font-bold mb-4" data-testid="text-team-title">
                  Meet Our <span className="text-purple-500">Team</span>
                </h2>
                <div className="h-px w-48 mx-auto mt-6 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <AnimatedSection key={member.id || index} delay={index * 100}>
                    <Tilt
                      tiltMaxAngleX={5}
                      tiltMaxAngleY={5}
                      glareEnable={true}
                      glareMaxOpacity={0.05}
                      scale={1.02}
                      className="h-full"
                    >
                      <Card className="glow-border p-6 text-center relative overflow-hidden rounded-3xl border-border/50 bg-card/30 backdrop-blur-sm" data-testid={`card-team-${index}`}>
                        <div className="glow-inner" />
                        <div className="relative mx-auto mb-6 w-28 h-28">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-purple-500 blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                          <Avatar className="w-28 h-28 relative border-4 border-background shadow-xl">
                            <AvatarImage src={member.profilePic} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-card to-background text-2xl font-bold">
                              {member.firstName?.[0]}{member.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <h3 className="text-xl font-bold mb-1" data-testid={`text-team-name-${index}`}>
                          {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-sm text-primary font-medium opacity-80" data-testid={`text-team-role-${index}`}>
                          {member.displayRole || member.role}
                        </p>
                      </Card>
                    </Tilt>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
