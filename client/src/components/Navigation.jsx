import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isAdmin = user?.roles?.includes('ADMIN') || user?.role === 'ADMIN';
  const isWriter = user?.roles?.includes('WRITER') || user?.role === 'WRITER';

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    setLocation("/login");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 px-2 py-1 rounded-md -ml-2 no-underline">
            <img
              src="/company-logo.png"
              alt="Kodekernel"
              className="w-16 h-16 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)] drop-shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:drop-shadow-[0_0_35px_rgba(56,189,248,0.4)] transition-all duration-300"
              data-testid="logo-icon"
            />
            <span className="text-xl font-bold tracking-tight text-white no-underline" style={{ textDecoration: 'none' }} data-testid="text-brand">Kodekernel</span>
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
              <Button
                data-testid="button-donate"
                className="relative px-6 py-2 font-semibold text-white bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 shadow-lg rounded-full overflow-hidden transition-all duration-300 hover:from-yellow-400 hover:via-pink-500 hover:to-red-400 hover:scale-105 focus:ring-2 focus:ring-pink-400/60 focus:outline-none before:absolute before:inset-0 before:bg-white/10 before:rounded-full before:blur before:opacity-0 hover:before:opacity-100"
                style={{ boxShadow: '0 0 16px 2px rgba(236,72,153,0.18), 0 2px 8px 0 rgba(251,191,36,0.10)' }}
              >
                Buy us a Coffee
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                data-testid="button-get-started"
                className="relative px-6 py-2 font-semibold text-white bg-gradient-to-r from-primary to-accent shadow-lg rounded-full overflow-hidden transition-all duration-300 hover:from-accent hover:to-primary hover:scale-105 focus:ring-2 focus:ring-accent/60 focus:outline-none before:absolute before:inset-0 before:bg-white/10 before:rounded-full before:blur before:opacity-0 hover:before:opacity-100"
                style={{ boxShadow: '0 0 16px 2px rgba(56,189,248,0.25), 0 2px 8px 0 rgba(56,189,248,0.10)' }}
              >
                Get in Touch
              </Button>
            </Link>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-white/80 rounded-full ml-2" title="Account">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer no-underline w-full block text-white">Profile Page</Link>
                    </DropdownMenuItem>
                    {(isWriter || isAdmin) && (
                      <DropdownMenuItem asChild>
                        <Link href="/write" className="cursor-pointer no-underline w-full block text-white">Write a Blog</Link>
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/controls" className="cursor-pointer no-underline w-full block text-white">Controls</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 w-full block">
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer no-underline w-full block">Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
                <Button
                  className="w-full relative px-6 py-2 font-semibold text-white bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 shadow-lg rounded-full overflow-hidden transition-all duration-300 hover:from-yellow-400 hover:via-pink-500 hover:to-red-400 hover:scale-105 focus:ring-2 focus:ring-pink-400/60 focus:outline-none before:absolute before:inset-0 before:bg-white/10 before:rounded-full before:blur before:opacity-0 hover:before:opacity-100"
                  style={{ boxShadow: '0 0 16px 2px rgba(236,72,153,0.18), 0 2px 8px 0 rgba(251,191,36,0.10)' }}
                  data-testid="button-mobile-donate"
                >
                  Buy us a Coffee
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  className="w-full mt-2 relative px-6 py-2 font-semibold text-white bg-gradient-to-r from-primary to-accent shadow-lg rounded-full overflow-hidden transition-all duration-300 hover:from-accent hover:to-primary hover:scale-105 focus:ring-2 focus:ring-accent/60 focus:outline-none before:absolute before:inset-0 before:bg-white/10 before:rounded-full before:blur before:opacity-0 hover:before:opacity-100"
                  style={{ boxShadow: '0 0 16px 2px rgba(56,189,248,0.25), 0 2px 8px 0 rgba(56,189,248,0.10)' }}
                  data-testid="button-mobile-get-started"
                >
                  Get in Touch
                </Button>
              </Link>

              <div className="border-t border-white/10 mt-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile">
                      <Button className="w-full justify-start text-white" variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                        Profile
                      </Button>
                    </Link>
                    {(isWriter || isAdmin) && (
                      <Link href="/write">
                        <Button className="w-full justify-start text-white" variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                          Write a Blog
                        </Button>
                      </Link>
                    )}
                    {isAdmin && (
                      <Link href="/controls">
                        <Button className="w-full justify-start text-white" variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                          Controls
                        </Button>
                      </Link>
                    )}
                    <Button className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/10" variant="ghost" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/login">
                    <Button className="w-full justify-start text-white" variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Button>
                  </Link>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
