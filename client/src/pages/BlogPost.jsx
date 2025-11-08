import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 gap-2" data-testid="button-back-to-blog">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>

          <div className="mb-8">
            <Badge className="mb-4" data-testid="badge-category">Development</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight" data-testid="text-post-title">
              Building Scalable SaaS Applications with Modern Tech Stack
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    SC
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold" data-testid="text-author">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">Senior Developer</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span data-testid="text-date">Jan 15, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span data-testid="text-readtime">8 min read</span>
                </div>
              </div>
            </div>
          </div>

          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-12" />

          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-6" data-testid="text-content-intro">
              Building a successful SaaS application requires careful planning, the right technology choices, 
              and a focus on scalability from day one. In this comprehensive guide, we'll explore the essential 
              components of a modern SaaS architecture and share proven strategies for building applications 
              that can grow with your business.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4" data-testid="text-heading-architecture">
              Choosing the Right Architecture
            </h2>
            <p className="leading-relaxed mb-6">
              The foundation of any scalable SaaS application is its architecture. We recommend starting with 
              a microservices approach when appropriate, but don't over-engineer in the beginning. A well-structured 
              monolith can serve you well initially and can be broken down into services as your needs grow.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4" data-testid="text-heading-stack">
              Technology Stack Considerations
            </h2>
            <p className="leading-relaxed mb-6">
              For the frontend, React with Next.js provides an excellent developer experience and built-in 
              optimizations for performance. On the backend, Node.js with Express or Fastify offers great 
              flexibility and performance. For databases, PostgreSQL remains our top choice for relational 
              data, while Redis is perfect for caching and session management.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4" data-testid="text-heading-deployment">
              Deployment and DevOps
            </h2>
            <p className="leading-relaxed mb-6">
              Modern deployment strategies emphasize automation and reliability. Containerization with Docker 
              and orchestration with Kubernetes provides the scalability and resilience needed for production 
              SaaS applications. Implement CI/CD pipelines from the start to ensure smooth, reliable deployments.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4" data-testid="text-heading-conclusion">
              Conclusion
            </h2>
            <p className="leading-relaxed mb-6">
              Building a scalable SaaS application is a journey that requires continuous learning and adaptation. 
              Focus on delivering value to your users while maintaining code quality and system reliability. 
              Start simple, measure everything, and scale based on real data and user needs.
            </p>
          </div>

          <Card className="p-8 mt-12 bg-card">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  SC
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold mb-2" data-testid="text-author-bio-name">About Sarah Chen</h3>
                <p className="text-muted-foreground text-sm leading-relaxed" data-testid="text-author-bio">
                  Sarah is a Senior Developer at Kodekernel with over 10 years of experience building 
                  scalable web applications. She specializes in React, Node.js, and cloud architecture.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </article>

      <Footer />
      <Chatbot />
    </div>
  );
}
