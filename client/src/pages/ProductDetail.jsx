import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ShoppingCart,
    ArrowLeft,
    CheckCircle2,
    Share2,
    ShieldCheck,
    Zap,
    Globe,
    Code2,
    Layers,
    Cpu,
    MessagesSquare,
    FileText,
    HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import * as LucideIcons from "lucide-react";

const DynamicIcon = ({ name, ...props }) => {
    const Icon = LucideIcons[name] || LucideIcons.Zap;
    return <Icon {...props} />;
};

export default function ProductDetail() {
    const [, params] = useRoute("/products/:id");
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        if (params?.id) {
            fetchProduct(params.id);
        }
    }, [params?.id]);

    const fetchProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Product not found");
                }
                throw new Error("Failed to fetch product");
            }
            const data = await response.json();
            setProduct(data);
        } catch (err) {
            console.error("Error fetching product:", err);
            setError(err.message);
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Link Copied!",
            description: "Product link copied to clipboard.",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="pt-32 pb-20 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-muted-foreground">Loading architecture specifications...</p>
                </div>
                <Footer />
                <Chatbot />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-background text-white">
                <Navigation />
                <div className="pt-32 pb-20 text-center max-w-2xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-4">404: Component Not Found</h1>
                    <p className="text-muted-foreground mb-8">
                        The requested product module could not be resolved in the current codebase.
                    </p>
                    <Link href="/projects">
                        <Button className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Registry
                        </Button>
                    </Link>
                </div>
                <Footer />
                <Chatbot />
            </div>
        );
    }

    const displayPrice = product.price.startsWith('$') ? product.price : `$${product.price}`;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navigation />

            <main className="pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Navigation Header */}
                    <div className="mb-12 flex items-center justify-between">
                        <Link href="/projects">
                            <Button variant="ghost" className="gap-2 group text-muted-foreground hover:text-white transition-all">
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                <span className="font-medium">Back to Store</span>
                            </Button>
                        </Link>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full border-border/50">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
                        {/* Primary Image: Visual Component */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-7"
                        >
                            <div className="relative group rounded-3xl overflow-hidden border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <img
                                    src={product.imageUrl || "/generated_images/SaaS_landing_page_92a46d2f.png"}
                                    alt={product.title}
                                    className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                                />
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <Badge className="bg-black/50 backdrop-blur-md border-white/10 text-white uppercase tracking-wider text-[10px] font-bold py-1 px-3">
                                        Verified Build
                                    </Badge>
                                </div>
                            </div>

                            {/* Feature Grid: Staff Level Technical Highlights */}
                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {(product.highlights && product.highlights.length > 0 ? product.highlights : [
                                    { icon: "Zap", title: "Low Latency", description: "Optimized for high performance and rapid response." },
                                    { icon: "ShieldCheck", title: "Secure by Design", description: "Built with industry-standard security protocols." },
                                    { icon: "Globe", title: "Scalable Arch", description: "Engineered to handle elastic workloads seamlessly." }
                                ]).map((item, idx) => (
                                    <div key={idx} className="p-6 rounded-2xl border border-border/50 bg-card/20 hover:bg-card/30 transition-colors">
                                        <div className="text-primary mb-3">
                                            <DynamicIcon name={item.icon} className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Product Meta & Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-5 flex flex-col"
                        >
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px]">
                                        {product.category?.name || "Uncategorized"}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground font-mono uppercase">Ref: SKU-{product.id.toString().padStart(4, '0')}</span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                                    {product.title}
                                </h1>

                                <div className="flex items-baseline gap-4 mb-8">
                                    <span className="text-5xl font-black text-white tracking-tighter">
                                        {displayPrice}
                                    </span>
                                    <span className="text-sm text-muted-foreground font-medium">USD + Lifecycle Updates</span>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center gap-2.5 text-green-500 bg-green-500/5 border border-green-500/10 rounded-full px-4 py-2 w-fit">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Production Stable</span>
                                    </div>
                                    <p className="text-lg text-muted-foreground leading-relaxed italic">
                                        "{product.description}"
                                    </p>
                                </div>
                            </div>

                            {/* Tech Stack Chips */}
                            <div className="mb-10">
                                <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Cpu className="w-3 h-3" /> Technical Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, i) => (
                                        <Badge key={i} variant="outline" className="bg-muted/30 text-white border-border/50 font-mono text-[11px] py-1 px-3">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* In-Page Notification Banner */}
                            {product.betaBannerEnabled && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-10 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-4 backdrop-blur-sm shadow-xl shadow-yellow-500/5"
                                >
                                    <LucideIcons.Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <p
                                        className="text-[11px] text-yellow-500/90 leading-relaxed font-medium"
                                        dangerouslySetInnerHTML={{
                                            __html: product.betaBannerMessage || "Information: Please contact support for procurement variations."
                                        }}
                                    />
                                </motion.div>
                            )}

                            <div className="mt-auto space-y-4">
                                <Button
                                    size="lg"
                                    className="w-full h-16 gap-3 text-lg font-black uppercase tracking-widest bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_auto] animate-gradient-slow hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-primary/20 border-0"
                                    onClick={() => {
                                        const link = product.buttonLink;
                                        if (link === "/contact") {
                                            const params = new URLSearchParams();
                                            params.append("product", product.title);
                                            params.append("title", product.description);
                                            window.location.href = `/contact?${params.toString()}`;
                                            return;
                                        }

                                        if (link) {
                                            if (link.startsWith("/")) {
                                                window.location.href = link;
                                            } else {
                                                window.open(link.startsWith("http") ? link : `https://${link}`, "_blank");
                                            }
                                        }
                                    }}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.buttonText || "Execute Acquisition"}
                                </Button>
                                {product.showDeliveryBadge && (
                                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider font-medium">
                                        Instant automated delivery via secure repository access
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Detailed Technical Content Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-border/50 pt-24">
                        {/* Middle: Content & Specs */}
                        <div className="lg:col-span-8 space-y-20">
                            {/* Tech Specs Table */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Code2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Technical Specifications</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.specs && Object.keys(product.specs).length > 0 ? (
                                        Object.entries(product.specs).map(([label, value], i) => (
                                            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-card/30 border border-border/50">
                                                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                                                <span className="text-sm font-bold text-white font-mono">{value}</span>
                                            </div>
                                        ))
                                    ) : (
                                        [
                                            { label: "Architecture", value: "Microservices Aware / Modular" },
                                            { label: "Deployment", value: "Docker / Kubernetes Ready" },
                                            { label: "CI/CD", value: "GitHub Actions Configured" },
                                            { label: "Testing", value: "Unit & Integration (Jest/JUnit)" },
                                            { label: "UI Library", value: "Tailwind CSS + ShadcnUI" },
                                            { label: "State Mgmt", value: "Redux Toolkit / Context API" },
                                        ].map((spec, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-card/30 border border-border/50">
                                                <span className="text-sm font-medium text-muted-foreground">{spec.label}</span>
                                                <span className="text-sm font-bold text-white font-mono">{spec.value}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Documentation / Included */}
                            <section className="p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-card/40 to-muted/10 border border-border/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <FileText className="w-32 h-32" />
                                </div>
                                <div className="relative">
                                    <h3 className="text-xl font-bold text-white mb-6">What's in the Box?</h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {(product.features && product.features.length > 0 ? product.features : [
                                            "Full Source Code Access (Git)",
                                            "System Architecture Diagrams",
                                            "Database Schema & Migrations",
                                            "Postman API Collections",
                                            "Deployment Workflows",
                                            "Standard Commercial License"
                                        ]).map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle2 className="w-3 h-3 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Main Overview */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Layers className="w-4 h-4 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">System Overview</h2>
                                </div>
                                <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:text-lg prose-p:leading-relaxed prose-strong:text-white">
                                    <ReactMarkdown>{product.longDescription || product.description}</ReactMarkdown>
                                </div>
                            </section>
                        </div>

                        {/* Right Sidebar: Support & FAQ */}
                        <div className="lg:col-span-4 space-y-12">
                            {/* Support Block */}
                            <div className="p-8 rounded-3xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                                <LucideIcons.MessagesSquare className="w-8 h-8 text-primary mb-6" />
                                <h3 className="text-xl font-bold text-white mb-2">{product.supportTitle || "Priority Support"}</h3>
                                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                    {product.supportDescription || "Need help with customization or deployment? Our core engineers are available for priority technical consulting."}
                                </p>
                                <Link href={product.supportButtonLink || "/contact"}>
                                    <Button variant="outline" className="w-full border-primary/30 hover:bg-primary text-primary hover:text-white font-bold">
                                        {product.supportButtonText || "Contact Engineer"}
                                    </Button>
                                </Link>
                            </div>

                            {/* Mini FAQ */}
                            <div>
                                <h3 className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-6 flex items-center gap-2">
                                    <LucideIcons.HelpCircle className="w-4 h-4" /> FAQ
                                </h3>
                                <div className="space-y-6">
                                    {(product.faqs && product.faqs.length > 0 ? product.faqs : [
                                        { question: "Is it a recurring subscription?", answer: "No, this is a one-time acquisition with lifetime access." },
                                        { question: "Can I use it for multiple clients?", answer: "The standard license covers usage for one commercial project." },
                                        { question: "Do you offer refunds?", answer: "Due to the digital nature of source code, we don't offer refunds once accessed." }
                                    ]).map((faq, i) => (
                                        <div key={i}>
                                            <h4 className="text-sm font-bold text-white mb-2">{faq.question}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </main >

            <Footer />
            <Chatbot />
        </div >
    );
}
