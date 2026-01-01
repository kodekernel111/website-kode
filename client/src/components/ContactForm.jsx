import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin } from "lucide-react";

const DIAL_CODES = {
  IN: "+91", US: "+1", UK: "+44", CA: "+1", AU: "+61",
  DE: "+49", FR: "+33", IT: "+39", ES: "+34", JP: "+81",
  CN: "+86", BR: "+55", RU: "+7", KR: "+82", SG: "+65",
  UAE: "+971", SA: "+966", ZA: "+27", NG: "+234"
};

export default function ContactForm() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Auto-fill from Auth and Query Params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productTitle = params.get("product");
    const productName = params.get("title");

    setFormData(prev => {
      const formattedPhone = (() => {
        if (!user?.phone) return "";
        if (user.phone.startsWith("+")) return user.phone;
        const code = DIAL_CODES[user.country] || "";
        return code ? `${code} ${user.phone}` : user.phone;
      })();

      return {
        ...prev,
        name: prev.name || (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "") || "",
        email: prev.email || user?.email || "",
        service: productTitle ? "saas-solutions" : prev.service,
        message: (productTitle && !prev.message)
          ? `Hello, I am interested in acquiring the source code for "${productTitle}". \n\nProduct Description: ${productName || "Please provide more details."}\n\n${formattedPhone ? `Contact Number: ${formattedPhone}\n\n` : ''}Please let me know the procurement process.`
          : prev.message
      };
    });
  }, [user, isAuthenticated]);

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("https://ihvyaao9x5.execute-api.eu-north-1.amazonaws.com/prod/contact-form-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast({ title: "Message sent", description: "We'll get back to you shortly." });
        setFormData({ name: "", email: "", service: "", message: "" });
      } else {
        toast({ title: "Send failed", description: "Failed to send message. Please try again." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({ title: "Error", description: "An error occurred while sending your message." });
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <svg className="animate-spin h-12 w-12 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      )}
      <section className="pt-12 lg:pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="fadeIn" className="text-center mb-8">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-contact-title">
              Get In Touch
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-contact-subtitle">
              Ready to start your project? Contact us today and let's build something amazing together.
            </p>
            <div className="h-px w-48 mx-auto mt-8 mb-12 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatedSection animation="fadeUp" delay={60}>
                <Card className="glow-border p-8 relative overflow-hidden transition-all duration-300 rounded-2xl border-transparent hover:shadow-2xl">
                  <div className="glow-inner" />
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name - floating label */}
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        placeholder=" "
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        data-testid="input-name"
                        className="peer w-full p-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_12px_rgba(99,102,241,0.12)] transition-all duration-300"
                      />
                      <label htmlFor="name" className={`absolute left-4 ${formData.name ? 'top-0' : 'top-3'} bg-[#181824] px-1 text-gray-400 pointer-events-none transition-all duration-200 ${formData.name ? '-translate-y-1/2 text-xs text-indigo-300' : 'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-indigo-300'}`}>
                        Name
                      </label>
                    </div>

                    {/* Email - floating label */}
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        placeholder=" "
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        data-testid="input-email"
                        className="peer w-full p-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_12px_rgba(99,102,241,0.12)] transition-all duration-300"
                      />
                      <label htmlFor="email" className={`absolute left-4 ${formData.email ? 'top-0' : 'top-3'} bg-[#181824] px-1 text-gray-400 pointer-events-none transition-all duration-200 ${formData.email ? '-translate-y-1/2 text-xs text-indigo-300' : 'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-indigo-300'}`}>
                        Email
                      </label>
                    </div>

                    {/* Service select (keeps UI Select) */}
                    <div>
                      <Label htmlFor="service" className="mb-2 inline-block">Service Interest</Label>
                      <div className="mt-2">
                        <Select
                          value={formData.service}
                          onValueChange={(value) => setFormData({ ...formData, service: value })}
                        >
                          <SelectTrigger data-testid="select-service" className="border border-gray-700 bg-transparent text-gray-200">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web-development">Web Development</SelectItem>
                            <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                            <SelectItem value="mobile-apps">Mobile Apps</SelectItem>
                            <SelectItem value="saas-solutions">Buy SaaS / Source Code</SelectItem>
                            <SelectItem value="seo">SEO Optimization</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Message - floating label textarea */}
                    <div className="relative">
                      <textarea
                        id="message"
                        placeholder=" "
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        data-testid="textarea-message"
                        className="peer w-full p-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_12px_rgba(99,102,241,0.12)] transition-all duration-300 resize-none"
                      />
                      <label htmlFor="message" className={`absolute left-4 ${formData.message ? 'top-0' : 'top-3'} bg-[#181824] px-1 text-gray-400 pointer-events-none transition-all duration-200 ${formData.message ? '-translate-y-1/2 text-xs text-indigo-300' : 'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-indigo-300'}`}>
                        Message
                      </label>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <Button type="submit" className="w-full flex items-center justify-center gap-3" data-testid="button-submit" disabled={loading}>
                        {loading ? (
                          <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Card>
              </AnimatedSection>
            </div>

            <div className="space-y-6">
              <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }} className="group">
                <Card className="glow-border p-6 bg-[#0f0f16] border border-gray-800 shadow-sm hover:shadow-lg transition relative overflow-hidden rounded-xl">
                  <div className="glow-inner" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-700/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                      <Mail className="w-5 h-5 text-indigo-300 drop-shadow-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" data-testid="text-email-label">Email</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-email-value">
                        contact@kodekernel.com
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }} className="group hidden">
                <Card className="glow-border p-6 bg-[#0f0f16] border border-gray-800 shadow-sm hover:shadow-lg transition relative overflow-hidden rounded-xl">
                  <div className="glow-inner" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-700/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                      <Phone className="w-5 h-5 text-indigo-300 drop-shadow-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" data-testid="text-phone-label">Phone</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-phone-value">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }} className="group">
                <Card className="glow-border p-6 bg-[#0f0f16] border border-gray-800 shadow-sm hover:shadow-lg transition relative overflow-hidden rounded-xl">
                  <div className="glow-inner" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-700/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                      <MapPin className="w-5 h-5 text-indigo-300 drop-shadow-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" data-testid="text-address-label">Office</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-address-value">
                        Bengaluru, India
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
