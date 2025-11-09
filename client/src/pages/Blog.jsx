import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const blogPosts = [
  {
    id: "1",
    title: "Building Scalable SaaS Applications with Modern Tech Stack",
    excerpt: "Learn how to architect and build scalable SaaS applications using React, Node.js, and cloud technologies. We cover everything from database design to deployment strategies.",
    category: "Development",
    author: "Sarah Chen",
    authorInitials: "SC",
    date: "Jan 15, 2025",
    readTime: "8 min",
    featured: true,
  },
  {
    id: "2",
    title: "The Future of Web Design in 2025",
    excerpt: "Explore upcoming trends in web design including AI-powered layouts, immersive 3D experiences, and the evolution of design systems.",
    category: "Design",
    author: "Mike Johnson",
    authorInitials: "MJ",
    date: "Jan 12, 2025",
    readTime: "5 min",
  },
  {
    id: "3",
    title: "Optimizing React Performance for Production",
    excerpt: "Practical tips and techniques for improving React application performance, from code splitting to memoization strategies.",
    category: "Development",
    author: "Alex Thompson",
    authorInitials: "AT",
    date: "Jan 8, 2025",
    readTime: "10 min",
  },
  {
    id: "4",
    title: "Creating Accessible Web Applications",
    excerpt: "A comprehensive guide to building web applications that everyone can use, covering WCAG guidelines and best practices.",
    category: "Accessibility",
    author: "Emily Parker",
    authorInitials: "EP",
    date: "Jan 5, 2025",
    readTime: "7 min",
  },
  {
    id: "5",
    title: "SEO Strategies That Actually Work in 2025",
    excerpt: "Modern SEO techniques that deliver real results, including technical optimization, content strategy, and link building.",
    category: "Marketing",
    author: "David Wilson",
    authorInitials: "DW",
    date: "Jan 1, 2025",
    readTime: "6 min",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-blog-title">
              Our Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8" data-testid="text-blog-subtitle">
              Technical insights, industry trends, and expert perspectives from our team. 
              Published every weekend.
            </p>
            <div className="h-px w-48 mx-auto mt-8 mb-12 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-12"
                data-testid="input-blog-search"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <AnimatedSection key={post.id} delay={index * 100}>
                <BlogCard {...post} />
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" data-testid="button-load-more">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
