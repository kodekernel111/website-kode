import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Pricing from "@/pages/Pricing";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Testimonials from "@/pages/Testimonials";
import Contact from "@/pages/Contact";
import Projects from "@/pages/Projects";
import Donate from "@/pages/Donate";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Logout from "@/pages/Logout";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Navigation from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "@/pages/Profile";
import WriteBlog from "@/pages/WriteBlog";
import EditorComparison from "@/pages/EditorComparison";

import Controls from "@/pages/Controls";
import ProductDetail from "@/pages/ProductDetail";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28 }}
      >
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:id" component={BlogPost} />
          <Route path="/testimonials" component={Testimonials} />
          <Route path="/contact" component={Contact} />
          <Route path="/projects" component={Projects} />
          <Route path="/donate" component={Donate} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/logout" component={Logout} />
          <Route path="/profile" component={Profile} />
          <Route path="/write" component={WriteBlog} />
          <Route path="/editor-comparison" component={EditorComparison} />
          <Route path="/controls" component={Controls} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/privacypolicy" component={PrivacyPolicy} />
          <Route path="/termsofservice" component={TermsOfService} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

import Lenis from "lenis";

function App() {
  const [location] = useLocation();

  useEffect(() => {
    // Disable Lenis on Signup page to avoid Radix UI Select conflict
    if (location === "/signup") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Navigation />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
