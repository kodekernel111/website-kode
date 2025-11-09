import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2 } from "lucide-react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 px-2 py-1 rounded-md -ml-2">
            <img 
              src="/company-logo.png" 
              alt="Kodekernel" 
              className="w-16 h-16 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)] drop-shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:drop-shadow-[0_0_35px_rgba(56,189,248,0.4)] transition-all duration-300" 
              data-testid="logo-icon" 
            />
            <span className="text-xl font-bold tracking-tight text-white" data-testid="text-brand">Kodekernel</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`text-white ${location === link.href ? "bg-accent" : ""}`}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/donate">
              <Button variant="outline" className="text-white" data-testid="button-donate">
                Buy us a Coffee
              </Button>
            </Link>
            <Link href="/contact">
              <Button data-testid="button-get-started">
                Get Started
              </Button>
            </Link>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2" data-testid="menu-mobile">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white ${location === link.href ? "bg-accent" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/donate">
                <Button variant="outline" className="w-full text-white" data-testid="button-mobile-donate">
                  Buy us a Coffee
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="w-full" data-testid="button-mobile-get-started">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
