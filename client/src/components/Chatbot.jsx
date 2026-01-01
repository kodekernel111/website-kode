import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const faqs = [
  {
    keywords: ["price", "pricing", "cost", "how much"],
    response: "We offer three flexible tiers: Starter ($999 for foundational projects), Professional ($2,499 for growing businesses with CMS integration), and Enterprise (Custom solutions for elite scale). All plans include dedicated support and premium delivery."
  },
  {
    keywords: ["service", "services", "what do you do", "offer"],
    response: "We specialize in high-end Web Development (React/Next.js/Spring Boot), UI/UX Design (Figma/Prototyping), Mobile Apps, and AI Integrations. We also sell production-ready source codes in our Store!"
  },
  {
    keywords: ["contact", "reach", "email", "phone"],
    response: "You can reach us at contact@kodekernel.com or visit our Contact page to get in touch. We typically respond to all inquiries within 24 hours!"
  },
  {
    keywords: ["timeline", "how long", "duration", "time"],
    response: "Project timelines vary based on complexity. Starter projects typically take 2-3 weeks, Professional projects 4-8 weeks, and Enterprise projects are estimated individually. We can provide a detailed timeline after discussing your requirements."
  },
  {
    keywords: ["support", "maintenance", "help"],
    response: "All our plans include ongoing support. Starter includes 1 month, Professional includes 3 months, and Enterprise includes priority support with a dedicated account manager."
  },
  {
    keywords: ["start", "begin", "get started"],
    response: "Getting started is easy! Click 'Get Started' on any page or visit our Contact page to tell us about your project. We'll schedule a free consultation to discuss your needs."
  },
  {
    keywords: ["portfolio", "work", "examples", "projects"],
    response: "You can view our portfolio on the Services page, where we showcase projects including e-commerce platforms, SaaS dashboards, and more. Would you like me to direct you there?"
  },
  {
    keywords: ["technology", "tech stack", "technologies"],
    response: "Our core stack is built for scale: Frontend (React, Next.js, Framer Motion), Backend (Spring Boot, Node.js), and Database (PostgreSQL). We focus on typing (TypeScript) and clean architecture."
  },
  {
    keywords: ["who are you", "what is this", "kodekernel"],
    response: "I am the Kodekernel Assistant! Kodekernel is a premium digital agency and software store where you can buy high-quality source code for MVPs or hire us to build custom solutions from scratch."
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Kodekernel's assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [products, setProducts] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => res.ok ? res.json() : [])
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products for chatbot:", err));

    fetch("http://localhost:8080/api/config")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const val = data.find(c => c.configKey === "chatbot_enabled")?.configValue;
        setIsVisible(val !== "false");
      })
      .catch(e => console.error("Error fetching chatbot config:", e));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findResponse = (input) => {
    const lowerInput = input.toLowerCase();

    // 1. Check for specific product mentions
    if (lowerInput.includes("product") || lowerInput.includes("buy") || lowerInput.includes("source code") || lowerInput.includes("what do you have")) {
      const foundProducts = products.filter(p =>
        p.title.toLowerCase().includes(lowerInput) ||
        p.description.toLowerCase().includes(lowerInput) ||
        p.category?.name?.toLowerCase().includes(lowerInput)
      ).slice(0, 3);

      if (foundProducts.length > 0) {
        let resp = "I found some products that might interest you:\n\n";
        foundProducts.forEach(p => {
          resp += `• ${p.title} (${p.price})\n`;
        });
        resp += "\nYou can find these and more in our Projects section!";
        return resp;
      }
    }

    // 2. Exact match check for faqs
    for (const faq of faqs) {
      if (faq.keywords.some(keyword => lowerInput.includes(keyword))) {
        return faq.response;
      }
    }

    // 3. Category search
    const categories = Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)));
    const matchedCategory = categories.find(cat => lowerInput.includes(cat.toLowerCase()));
    if (matchedCategory) {
      const catProducts = products.filter(p => p.category?.name === matchedCategory).slice(0, 3);
      return `We have several products in the ${matchedCategory} category, including ${catProducts.map(p => p.title).join(", ")}. You can see the full list in our store!`;
    }

    return "I'm here to help! You can ask me about our specific products, available source codes, pricing, contact information, or our tech stack. What would you like to know?";
  };

  const handleSend = (text) => {
    const messageText = typeof text === "string" ? text : inputValue;
    if (!messageText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: findResponse(messageText),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const quickActions = [
    "What products do you have?",
    "Show me pricing plans",
    "How do I get started?",
    "View tech stack",
    "Contact information"
  ];

  const dynamicCategories = Array.from(new Set(products.map(p => p.category?.name).filter(Boolean))).slice(0, 3);

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 right-0 p-6 z-50">
        {!isOpen && (
          <Button
            size="icon"
            className="w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:scale-110"
            onClick={() => setIsOpen(true)}
            data-testid="button-open-chat"
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </Button>
        )}

        {isOpen && (
          <Card className="w-96 h-[500px] flex flex-col shadow-xl rounded-2xl bg-background" data-testid="card-chatbot">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold" data-testid="text-chatbot-title">Kodekernel Assistant</h3>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-chat"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="container-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  data-testid={`message-${message.id}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${message.isBot
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                      }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-muted/20">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3 px-1">Suggested Questions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action)}
                    className="text-[11px] bg-background border border-border hover:border-primary hover:text-primary px-3 py-1.5 rounded-full transition-all duration-200 text-left"
                  >
                    {action}
                  </button>
                ))}
                {dynamicCategories.map((cat, i) => (
                  <button
                    key={`cat-${i}`}
                    onClick={() => handleSend(`Show me ${cat} products`)}
                    className="text-[11px] bg-background border border-primary/20 text-primary/80 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-all duration-200"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
