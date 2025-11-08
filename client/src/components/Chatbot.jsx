import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const faqs = [
  {
    keywords: ["price", "pricing", "cost", "how much"],
    response: "We offer three pricing tiers: Starter ($999), Professional ($2,499), and Enterprise (custom pricing). Each plan includes different features and support levels. Would you like to know more about a specific plan?"
  },
  {
    keywords: ["service", "services", "what do you do", "offer"],
    response: "We offer Web Development, UI/UX Design, Mobile Apps, SaaS Solutions, SEO Optimization, and Analytics & Insights. Which service are you interested in?"
  },
  {
    keywords: ["contact", "reach", "email", "phone"],
    response: "You can reach us at hello@kodekernel.com or call us at +1 (555) 123-4567. Our office is located at 123 Tech Street, San Francisco, CA 94105."
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
    response: "We work with modern technologies including React, Next.js, Node.js, TypeScript, PostgreSQL, and cloud platforms. We choose the best tech stack for each project's specific needs."
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Kodekernel's assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    for (const faq of faqs) {
      if (faq.keywords.some(keyword => lowerInput.includes(keyword))) {
        return faq.response;
      }
    }
    
    return "I'm here to help! You can ask me about our services, pricing, contact information, project timelines, or how to get started. What would you like to know?";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: findResponse(inputValue),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          size="icon"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50"
          onClick={() => setIsOpen(true)}
          data-testid="button-open-chat"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] z-50 flex flex-col shadow-xl" data-testid="card-chatbot">
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
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isBot
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

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="input-chat-message"
              />
              <Button
                size="icon"
                onClick={handleSend}
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
