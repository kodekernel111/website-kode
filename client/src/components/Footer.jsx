import { Link } from "wouter";
import { Code2, Mail, Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Code2 className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">Kodekernel</span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Delivering premium web design and development SaaS solutions to transform your digital presence.
            </p>
            <div className="flex gap-3">
              <Button size="icon" variant="ghost" data-testid="link-twitter">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="link-linkedin">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="link-github">
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-company">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">About Us</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-services">Services</Link></li>
              <li><Link href="/testimonials" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-testimonials">Testimonials</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-resources">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-blog">Blog</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-pricing">Pricing</Link></li>
              <li><Link href="/donate" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-donate">Support Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-newsletter">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with our latest insights and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-newsletter-email"
              />
              <Button type="submit" className="w-full" data-testid="button-newsletter-submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2025 Kodekernel. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
