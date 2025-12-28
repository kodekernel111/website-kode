import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Info } from "lucide-react";



const staticMvps = [];

export default function MVPShowcase() {
    const [filter, setFilter] = useState("All");
    const [location, setLocation] = useLocation();
    const [dbProducts, setDbProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceFilter, setPriceFilter] = useState("all");
    const ITEMS_PER_PAGE = 9;

    const [config, setConfig] = useState({ enabled: true, message: "" });
    const DEFAULT_MESSAGE = `<span class="font-semibold">Beta Access:</span> Payments are not currently supported. If you are interested in purchasing an MVP/Digital Product, please contact us at <a href="mailto:contact@kodekernel.com" class="text-yellow-400 hover:text-yellow-300 underline font-medium transition-colors">contact@kodekernel.com</a> or visit our <a href="/contact" class="text-yellow-400 hover:text-yellow-300 underline cursor-pointer font-medium transition-colors">Get in Touch</a> page.`;

    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then(res => res.ok ? res.json() : [])
            .then(data => setDbProducts(data))
            .catch(err => console.error(err));

        fetch("http://localhost:8080/api/config")
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (data.length > 0) {
                    const enabledStr = data.find(c => c.configKey === "beta_enabled")?.configValue;
                    const message = data.find(c => c.configKey === "beta_message")?.configValue;
                    setConfig({
                        enabled: enabledStr !== undefined ? enabledStr === "true" : true,
                        message: message || ""
                    });
                }
            })
            .catch(err => console.error(err));
    }, []);

    const combined = [
        ...staticMvps,
        ...dbProducts.map(p => ({
            ...p,
            image: p.imageUrl || "/generated_images/SaaS_landing_page_92a46d2f.png",
            tags: p.tags || []
        }))
    ];

    const categories = useMemo(() => ["All", ...Array.from(new Set(combined.map(p => p.category)))], [combined]);

    const filtered = combined.filter(p => {
        // Category
        if (filter !== "All" && p.category !== filter) return false;

        // Search
        if (searchTerm) {
            const lowerInfo = searchTerm.toLowerCase();
            const matchTitle = p.title.toLowerCase().includes(lowerInfo);
            const matchDesc = p.description.toLowerCase().includes(lowerInfo);
            const matchTags = p.tags.some(t => t.toLowerCase().includes(lowerInfo));
            if (!matchTitle && !matchDesc && !matchTags) return false;
        }

        // Price
        if (priceFilter !== "all") {
            const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0;
            if (priceFilter === "low" && priceNum >= 500) return false; // < 500 logic fixed below: Low is < 500
            if (priceFilter === "mid" && (priceNum < 500 || priceNum > 1000)) return false;
            if (priceFilter === "high" && priceNum <= 1000) return false;
        }

        // Fix Price Logic:
        // Low: < 500
        // Mid: 500 - 1000
        // High: > 1000
        if (priceFilter === "low" && parseFloat(p.price.replace(/[^0-9.]/g, '')) >= 500) return false;
        if (priceFilter === "mid" && (parseFloat(p.price.replace(/[^0-9.]/g, '')) < 500 || parseFloat(p.price.replace(/[^0-9.]/g, '')) > 1000)) return false;
        if (priceFilter === "high" && parseFloat(p.price.replace(/[^0-9.]/g, '')) <= 1000) return false;

        return true;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchTerm, priceFilter]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const cardVariants = {
        initial: { opacity: 0, y: 12 },
        enter: { opacity: 1, y: 0 },
        hover: { scale: 1.02, rotate: 0 },
    };

    return (
        <section className="py-8 bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white" data-testid="text-mvp-title">
                        Kodekernel <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">Store</span>
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-3xl mx-auto" data-testid="text-mvp-subtitle">
                        Accelerate your startup with our production-ready MVPs and source codes. Built in-house, tested, and ready to scale.
                    </p>
                    <div className="h-px w-48 mx-auto mt-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
                </div>

                {/* Beta Warning */}
                {config.enabled && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
                        <Info className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        <p className="text-sm text-yellow-500/90" dangerouslySetInnerHTML={{ __html: config.message || DEFAULT_MESSAGE }} />
                    </div>
                )}

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-card border-border/50 text-white placeholder:text-muted-foreground"
                        />
                    </div>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                        <SelectTrigger className="w-full md:w-[180px] bg-card border-border/50 text-white">
                            <SelectValue placeholder="Price Range" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border/50 text-white">
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="low">Under $500</SelectItem>
                            <SelectItem value="mid">$500 - $1000</SelectItem>
                            <SelectItem value="high">Over $1000</SelectItem>
                        </SelectContent>
                    </Select>

                </div>



                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {currentItems.map((mvp, index) => (
                        <motion.div
                            key={index}
                            initial="initial"
                            whileInView="enter"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={cardVariants}
                            transition={{ type: "spring", stiffness: 220, damping: 20 }}
                        >
                            <Tilt
                                tiltMaxAngleX={4}
                                tiltMaxAngleY={4}
                                glareEnable={true}
                                glareMaxOpacity={0.05}
                                scale={1}
                                className="h-full"
                            >
                                <Card className="h-full flex flex-col glow-border relative overflow-hidden transition-all duration-300 rounded-2xl border-border/50 bg-card/40 hover:bg-card/60 hover:shadow-2xl">
                                    <div className="glow-inner" />
                                    <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl bg-black/20">
                                        <img
                                            src={mvp.image}
                                            alt={mvp.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                                            {mvp.price}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs text-primary font-medium px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                                {mvp.category}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold mb-2 text-white">{mvp.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{mvp.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {mvp.tags.map((tag, i) => (
                                                <Badge key={i} variant="outline" className="text-[10px] text-muted-foreground border-border/50">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <Button
                                            className="w-full gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0"
                                            onClick={() => {
                                                const link = mvp.buttonLink;
                                                if (link) {
                                                    if (link.startsWith("/")) {
                                                        setLocation(link);
                                                    } else if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(link)) {
                                                        window.open(link, "_blank");
                                                    } else {
                                                        window.open("https://" + link, "_blank");
                                                    }
                                                }
                                            }}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            {mvp.buttonText || "Buy Source Code"}
                                        </Button>
                                    </div>
                                </Card>
                            </Tilt>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center items-center gap-4 mt-12">
                    <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="text-white border-border/50 hover:bg-primary/20 disabled:opacity-50"
                    >
                        Previous
                    </Button>
                    <span className="text-muted-foreground text-sm">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="text-white border-border/50 hover:bg-primary/20 disabled:opacity-50"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </section >
    );
}
