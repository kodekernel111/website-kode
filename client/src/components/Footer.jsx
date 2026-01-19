import { Link } from "wouter";
import { Code2, Mail, Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import API_BASE_URL from '../config';

export default function Footer() {
  const [email, setEmail] = useState("");
  const [socials, setSocials] = useState({ twitter: "", linkedin: "", github: "" });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/config`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setSocials({
          twitter: data.find(c => c.configKey === "social_twitter")?.configValue || "",
          linkedin: data.find(c => c.configKey === "social_linkedin")?.configValue || "",
          github: data.find(c => c.configKey === "social_github")?.configValue || ""
        });
      })
      .catch(err => console.error("Footer config fetch error", err));
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 no-underline">
              <Code2 className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold no-underline text-foreground hover:text-foreground focus:text-foreground" style={{ textDecoration: 'none' }}>Kodekernel</span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Shipping MVPs quickly without cutting corners on quality.
            </p>
            <div className="flex gap-3">
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="ghost" data-testid="link-twitter">
                    <Twitter className="w-5 h-5" />
                  </Button>
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="ghost" data-testid="link-linkedin">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </a>
              )}
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="ghost" data-testid="link-github">
                    <Github className="w-5 h-5" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-company">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline" data-testid="link-footer-about">About Us</Link></li>
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline" data-testid="link-footer-services">Services</Link></li>
              <li><Link href="/testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline" data-testid="link-footer-testimonials">Testimonials</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline" data-testid="link-footer-contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-resources">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline" data-testid="link-footer-blog">Blog</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline" data-testid="link-footer-pricing">Pricing</Link></li>
              <li><Link href="/donate" className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline" data-testid="link-footer-donate">Support Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-newsletter">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Stay updated with our latest insights and updates.
            </p>
            <p className="text-xs text-muted-foreground mb-4 italic">Coming soon</p>
            <form className="space-y-2 opacity-60 pointer-events-none select-none">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                disabled
                data-testid="input-newsletter-email"
              />
              <Button type="button" className="w-full" disabled data-testid="button-newsletter-submit">
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
            <Link href="/privacypolicy" className="text-muted-foreground hover:text-foreground transition-colors no-underline" data-testid="link-privacy">Privacy Policy</Link>
            <Link href="/termsofservice" className="text-muted-foreground hover:text-foreground transition-colors no-underline" data-testid="link-terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
