import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import MDEditor from "@uiw/react-md-editor";
import {
    Plus, Trash2, Edit2, Star, User as UserIcon, Search, Loader2, X,
    Code, Palette, Smartphone, Rocket, BarChart, Upload
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as LucideIcons from "lucide-react";

const HIGHLIGHT_ICONS = ["Zap", "ShieldCheck", "Globe", "Cpu", "Layers", "Code2", "Smartphone", "Activity", "Database", "Search", "Rocket", "BarChart", "MessagesSquare", "Star", "Palette"];

const ICON_STYLES = {
    Code: { gradient: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-500" },
    Palette: { gradient: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-500" },
    Smartphone: { gradient: "from-green-500/20 to-emerald-500/20", iconColor: "text-green-500" },
    Rocket: { gradient: "from-orange-500/20 to-red-500/20", iconColor: "text-orange-500" },
    Search: { gradient: "from-yellow-500/20 to-amber-500/20", iconColor: "text-yellow-500" },
    BarChart: { gradient: "from-indigo-500/20 to-violet-500/20", iconColor: "text-indigo-500" }
};

export default function Controls() {
    const { user, isAuthenticated, token } = useSelector((state) => state.auth);
    const [_, setLocation] = useLocation();
    const { toast } = useToast();

    // Authorization Helper
    const isAdmin = user?.roles?.includes("ADMIN") || user?.role === "ADMIN";

    // Data States
    const [plans, setPlans] = useState([]);
    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);

    // User Management States
    const [teamMembers, setTeamMembers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Dialog States
    const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
    const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [cursorPos, setCursorPos] = useState(null);

    // Settings State
    const [settingsForm, setSettingsForm] = useState({
        betaEnabled: false,
        betaMessage: "",
        teamSectionEnabled: true,
        buyCoffeeEnabled: true,
        chatbotEnabled: true,
        heroBadge: "Trusted by Businesses Worldwide",
        heroTitle1: "Transform Your Digital",
        heroTitle2: "Presence Today",
        heroDesc: "Kodekernel delivers cutting-edge web design and development solutions that drive results. Partner with us to build exceptional digital experiences.",
        heroStats: [
            { value: "10+", label: "Happy Clients" },
            { value: "20+", label: "Projects Completed" },
            { value: "99%", label: "Client Satisfaction" },
            { value: "24/7", label: "Support Available" }
        ]
    });

    // Style Lock State for Service Dialog
    const [isStyleLocked, setIsStyleLocked] = useState(true);

    // Forms
    const [editingId, setEditingId] = useState(null);
    const [planForm, setPlanForm] = useState({
        name: "", price: "", period: "per project", description: "", features: "", popular: false, order: 1
    });
    const [serviceForm, setServiceForm] = useState({
        title: "", description: "", features: "", icon: "Code", gradient: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-500", displayOrder: 1
    });
    const [testimonialForm, setTestimonialForm] = useState({
        name: "", role: "", content: "", rating: 5, displayOrder: 1
    });
    const [productForm, setProductForm] = useState({
        title: "", price: "", categoryId: "", description: "", longDescription: "", features: "", specs: "", tags: "", imageUrl: "", buttonText: "Buy Source Code", buttonLink: "",
        highlights: "", faqs: "", supportTitle: "Priority Support", supportDescription: "", supportButtonText: "Contact Engineer", supportButtonLink: "/contact",
        showDeliveryBadge: true,
        betaBannerEnabled: false,
        betaBannerMessage: ""
    });
    const [categoryForm, setCategoryForm] = useState({ name: "" });
    const [userForm, setUserForm] = useState({
        roles: ["USER"], displayRole: "", showOnTeam: false
    });
    const [newRoleName, setNewRoleName] = useState("");

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) return;
        fetchData();
        fetchRoles();
        fetchCategories();
        fetchTeamMembers();
    }, [isAuthenticated, user, token, isAdmin]);


    // Live Search Effect
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            fetchSuggestions(searchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Outside click to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSuggestions = async (query) => {
        setIsSearching(true);
        setShowSuggestions(true);
        try {
            const url = `http://localhost:8080/api/users?query=${encodeURIComponent(query)}`;
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                setSuggestions(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch suggestions", error);
        } finally {
            setIsSearching(false);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/users/team");
            if (res.ok) setTeamMembers(await res.json());
        } catch (error) {
            console.error("Failed to fetch team", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/roles", { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setAvailableRoles(await res.json());
        } catch (error) {
            console.error("Failed to fetch roles", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/product-categories");
            if (res.ok) setCategories(await res.json());
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchData = async () => {
        try {
            const [plansRes, servicesRes, testimonialsRes, productsRes] = await Promise.all([
                fetch("http://localhost:8080/api/pricing-plans"),
                fetch("http://localhost:8080/api/services"),
                fetch("http://localhost:8080/api/testimonials"),
                fetch("http://localhost:8080/api/products")
            ]);

            if (plansRes.ok) setPlans(await plansRes.json());
            if (servicesRes.ok) setServices(await servicesRes.json());
            if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
            if (productsRes.ok) setProducts(await productsRes.json());

            const confRes = await fetch("http://localhost:8080/api/config");
            if (confRes.ok) {
                const confData = await confRes.json();
                const enabled = confData.find(c => c.configKey === "beta_enabled")?.configValue === "true";
                const message = confData.find(c => c.configKey === "beta_message")?.configValue || "";
                const teamEnabled = confData.find(c => c.configKey === "team_section_enabled")?.configValue !== "false"; // Default true if missing
                const coffeeEnabled = confData.find(c => c.configKey === "buy_coffee_enabled")?.configValue !== "false"; // Default true if missing
                const chatbotEnabled = confData.find(c => c.configKey === "chatbot_enabled")?.configValue !== "false"; // Default true if missing

                const heroBadge = confData.find(c => c.configKey === "hero_badge")?.configValue || "Trusted by Businesses Worldwide";
                const heroTitle1 = confData.find(c => c.configKey === "hero_title1")?.configValue || "Transform Your Digital";
                const heroTitle2 = confData.find(c => c.configKey === "hero_title2")?.configValue || "Presence Today";
                const heroDesc = confData.find(c => c.configKey === "hero_desc")?.configValue || "Kodekernel delivers cutting-edge web design and development solutions that drive results. Partner with us to build exceptional digital experiences.";

                let heroStats = [
                    { value: "10+", label: "Happy Clients" },
                    { value: "20+", label: "Projects Completed" },
                    { value: "99%", label: "Client Satisfaction" },
                    { value: "24/7", label: "Support Available" }
                ];
                const statsJson = confData.find(c => c.configKey === "hero_stats")?.configValue;
                if (statsJson) {
                    try { heroStats = JSON.parse(statsJson); } catch (e) { console.error("Failed to parse hero stats", e); }
                }

                setSettingsForm({
                    betaEnabled: enabled,
                    betaMessage: message,
                    teamSectionEnabled: teamEnabled,
                    buyCoffeeEnabled: coffeeEnabled,
                    chatbotEnabled: chatbotEnabled,
                    heroBadge,
                    heroTitle1,
                    heroTitle2,
                    heroDesc,
                    heroStats
                });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
        }
    };

    // Helper: Render Icon
    const renderIcon = (iconName) => {
        const icons = { Code, Palette, Smartphone, Rocket, BarChart, Search };
        const IconComponent = icons[iconName] || Code;
        return <IconComponent className="w-5 h-5" />;
    };

    // --- Handlers ---
    const openPlanDialog = (plan = null) => { setEditingId(plan?.id); setPlanForm(plan ? { ...plan, features: plan.features.join("\n") } : { name: "", price: "", period: "per project", description: "", features: "", popular: false, order: plans.length + 1 }); setIsPlanDialogOpen(true); };
    const handlePlanSubmit = async (e) => { e.preventDefault(); await submitData("pricing-plans", editingId, { ...planForm, features: planForm.features.split("\n").filter(f => f.trim()) }, setIsPlanDialogOpen); };

    // Service Handlers (Updated for auto-populate)
    const openServiceDialog = (service = null) => {
        setEditingId(service?.id);
        setServiceForm(service ? { ...service, features: service.features.join("\n") } : { title: "", description: "", icon: "Code", ...ICON_STYLES.Code, displayOrder: services.length + 1, features: "" });
        setIsStyleLocked(true); // Always lock on open
        setIsServiceDialogOpen(true);
    };

    const handleServiceIconChange = (v) => {
        const styles = ICON_STYLES[v] || ICON_STYLES.Code;
        setServiceForm({
            ...serviceForm,
            icon: v,
            gradient: isStyleLocked ? styles.gradient : serviceForm.gradient,
            iconColor: isStyleLocked ? styles.iconColor : serviceForm.iconColor
        });
    };

    const handleServiceSubmit = async (e) => { e.preventDefault(); await submitData("services", editingId, { ...serviceForm, features: serviceForm.features.split("\n").filter(f => f.trim()) }, setIsServiceDialogOpen); };

    const openTestimonialDialog = (t = null) => { setEditingId(t?.id); setTestimonialForm(t ? { ...t } : { name: "", role: "", content: "", rating: 5, displayOrder: testimonials.length + 1 }); setIsTestimonialDialogOpen(true); };
    const handleTestimonialSubmit = async (e) => { e.preventDefault(); await submitData("testimonials", editingId, testimonialForm, setIsTestimonialDialogOpen); };

    // Product Handlers
    const openProductDialog = (p = null) => {
        setEditingId(p?.id);
        const defaultText = "Buy Source Code";

        // Convert strings/collections
        const specsStr = p?.specs ? Object.entries(p.specs).map(([k, v]) => `${k}:${v}`).join("\n") : "";
        const highlightsStr = p?.highlights ? p.highlights.map(h => `${h.icon}|${h.title}|${h.description}`).join("\n") : "";
        const faqsStr = p?.faqs ? p.faqs.map(f => `${f.question}|${f.answer}`).join("\n") : "";

        setProductForm(p ? {
            ...p,
            categoryId: p.category?.id || "",
            tags: p.tags?.join(", ") || "",
            features: p.features?.join("\n") || "",
            specs: specsStr,
            highlights: highlightsStr,
            faqs: faqsStr,
            supportTitle: p.supportTitle || "Priority Support",
            supportDescription: p.supportDescription || "",
            supportButtonText: p.supportButtonText || "Contact Engineer",
            supportButtonLink: p.supportButtonLink || "/contact",
            buttonText: p.buttonText || defaultText,
            buttonLink: p.buttonLink || "",
            showDeliveryBadge: p.showDeliveryBadge ?? true,
            betaBannerEnabled: p.betaBannerEnabled || false,
            betaBannerMessage: p.betaBannerMessage || ""
        } : {
            title: "", price: "", categoryId: categories[0]?.id || "", description: "", longDescription: "",
            features: "", specs: "", tags: "", imageUrl: "",
            highlights: "", faqs: "", supportTitle: "Priority Support", supportDescription: "",
            supportButtonText: "Contact Engineer", supportButtonLink: "/contact",
            buttonText: defaultText, buttonLink: "",
            showDeliveryBadge: true,
            betaBannerEnabled: false,
            betaBannerMessage: ""
        });
        setIsProductDialogOpen(true);
    };

    const openCategoryDialog = (c = null) => {
        setEditingId(c?.id);
        setCategoryForm(c ? { name: c.name } : { name: "" });
        setIsCategoryDialogOpen(true);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        await submitData("product-categories", editingId, categoryForm, setIsCategoryDialogOpen);
        fetchCategories();
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        if (!productForm.categoryId) {
            toast({ title: "Validation Error", description: "Please select a category.", variant: "destructive" });
            return;
        }
        try {
            // Convert specs string back to map
            const specsMap = {};
            (productForm.specs || "").split("\n").forEach(line => {
                const parts = line.split(":");
                if (parts.length >= 2) {
                    const k = parts[0].trim();
                    const v = parts.slice(1).join(":").trim();
                    if (k && v) specsMap[k] = v;
                }
            });

            const highlightsArr = (productForm.highlights || "").split("\n").map(line => {
                const [icon, title, ...descParts] = line.split("|");
                const description = descParts.join("|")?.trim() || "";
                return (icon?.trim() && title?.trim()) ? { icon: icon.trim(), title: title.trim(), description } : null;
            }).filter(h => h);

            const faqsArr = (productForm.faqs || "").split("\n").map(line => {
                const [question, answer] = line.split("|");
                return (question?.trim() && answer?.trim()) ? { question: question.trim(), answer: answer.trim() } : null;
            }).filter(f => f);

            const payload = {
                ...productForm,
                category: { id: productForm.categoryId },
                tags: (productForm.tags || "").split(",").map(t => t.trim()).filter(t => t),
                features: (productForm.features || "").split("\n").map(f => f.trim()).filter(f => f),
                specs: specsMap,
                highlights: highlightsArr,
                faqs: faqsArr
            };

            console.log("Submitting Product Payload:", payload);

            await submitData("products", editingId, payload, setIsProductDialogOpen);
        } catch (err) {
            console.error("Form Processing Error:", err);
            toast({ title: "Form Error", description: "There was an error processing your product data. Check console.", variant: "destructive" });
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);
        try {
            const res = await fetch("http://localhost:8080/api/upload/image", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Upload failed");
            }

            const data = await res.json();
            setProductForm(prev => ({ ...prev, imageUrl: data.url }));
            toast({ title: "Success", description: "Image uploaded" });
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleUserImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);
        try {
            const res = await fetch("http://localhost:8080/api/upload/image", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Upload failed");
            }

            const data = await res.json();
            setUserForm(prev => ({ ...prev, profilePic: data.url }));
            toast({ title: "Success", description: "Image uploaded" });
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleMarkdownImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);
        try {
            const res = await fetch("http://localhost:8080/api/upload/image", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Upload failed");
            }

            const data = await res.json();
            const imageMarkdown = `\n![Image](${data.url})\n`;

            setProductForm(prev => {
                const currentContent = prev.longDescription || "";
                const insertAt = cursorPos || currentContent.length;
                const newContent = currentContent.slice(0, insertAt) + imageMarkdown + currentContent.slice(insertAt);
                return { ...prev, longDescription: newContent };
            });

            toast({ title: "Success", description: "Image added to editor" });
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    // --- User Handlers ---
    const selectUserForEdit = (u) => {
        setEditingId(u.id);
        setUserForm({
            roles: u.roles || [],
            displayRole: u.displayRole || "",
            showOnTeam: u.showOnTeam,
            profilePic: u.profilePic || "",
            bio: u.bio || ""
        });
        setSearchQuery("");
        setShowSuggestions(false);
        setIsUserDialogOpen(true);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        await submitData("users", editingId, userForm, setIsUserDialogOpen);
        fetchTeamMembers();
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;

        try {
            const res = await fetch("http://localhost:8080/api/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: newRoleName.toUpperCase().replace(/\s+/g, '_') }) // Store as uppercase enum-style
            });
            if (!res.ok) throw new Error("Failed to add role");
            toast({ title: "Success", description: "Role added successfully" });
            setNewRoleName("");
            setIsRoleDialogOpen(false);
            fetchRoles();
        } catch (err) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const saveSettings = async () => {
        try {
            const payload = [
                { configKey: "beta_enabled", configValue: settingsForm.betaEnabled.toString() },
                { configKey: "beta_message", configValue: settingsForm.betaMessage },
                { configKey: "team_section_enabled", configValue: settingsForm.teamSectionEnabled.toString() },
                { configKey: "buy_coffee_enabled", configValue: settingsForm.buyCoffeeEnabled.toString() },
                { configKey: "chatbot_enabled", configValue: settingsForm.chatbotEnabled.toString() },
                { configKey: "hero_badge", configValue: settingsForm.heroBadge },
                { configKey: "hero_title1", configValue: settingsForm.heroTitle1 },
                { configKey: "hero_title2", configValue: settingsForm.heroTitle2 },
                { configKey: "hero_desc", configValue: settingsForm.heroDesc },
                { configKey: "hero_stats", configValue: JSON.stringify(settingsForm.heroStats) }
            ];
            const res = await fetch("http://localhost:8080/api/config/batch", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to save settings");
            toast({ title: "Success", description: "Settings saved successfully" });
            fetchData(); // Refresh settings
        } catch (err) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const submitData = async (endpoint, id, payload, setOpen) => {
        const url = `http://localhost:8080/api/${endpoint}` + (id ? `/${id}` : "");
        const method = id ? "PUT" : "POST";
        try {
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error("Failed");
            toast({ title: "Success", description: "Saved successfully" });
            setOpen(false);
            if (endpoint !== 'users') fetchData();
        } catch (err) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const deleteData = async (endpoint, id) => {
        if (!confirm("Delete?")) return;
        try {
            await fetch(`http://localhost:8080/api/${endpoint}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            toast({ title: "Success", description: "Deleted" });
            fetchData();
        } catch (err) { toast({ title: "Error", description: "Failed to delete", variant: "destructive" }); }
    };

    if (!isAuthenticated || !isAdmin) return <div className="min-h-screen pt-32 text-center text-white"><Navigation /><h1>Access Denied</h1><Footer /></div>;

    return (
        <div className="min-h-screen bg-background text-white">
            <Navigation />
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Admin Controls</h1>

                <Tabs defaultValue="users" className="space-y-6">
                    <TabsList className="bg-muted/20 p-1 mb-8">
                        <TabsTrigger value="users">Users & Team</TabsTrigger>
                        <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="products">Store Products</TabsTrigger>
                        <TabsTrigger value="categories">Product Categories</TabsTrigger>
                        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* USERS & TEAM */}
                    <TabsContent value="users" className="space-y-6">
                        {/* Search Autocomplete */}
                        <div className="relative max-w-xl" ref={searchRef}>
                            <Label className="mb-2 block text-muted-foreground">Search and Add Users to Team</Label>
                            <div className="relative">
                                {isSearching ? (
                                    <Loader2 className="absolute left-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                                ) : (
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                )}
                                <Input
                                    placeholder="Search by name or email to configure..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                    className="pl-9 bg-card border-border/50 text-white placeholder:text-muted-foreground"
                                />
                            </div>

                            {/* Suggestions */}
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
                                    {suggestions.length === 0 && !isSearching ? (
                                        <div className="p-3 text-sm text-muted-foreground text-center">No users found</div>
                                    ) : (
                                        suggestions.map(u => (
                                            <div key={u.id} className="p-3 hover:bg-primary/10 cursor-pointer border-b border-border/20 flex items-center justify-between group" onClick={() => selectUserForEdit(u)}>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8 flex-shrink-0">
                                                        <AvatarImage src={u.profilePic} className="object-cover" />
                                                        <AvatarFallback className="bg-primary/20 text-xs font-bold text-primary">{u.firstName?.[0]}{u.lastName?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div><div className="text-sm font-medium">{u.firstName} {u.lastName}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                                                </div>
                                                <div className="text-xs text-muted-foreground group-hover:text-primary">Configure</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Current Team */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">Current Team Members</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {teamMembers.map(u => (
                                    <Card key={u.id} className="bg-card border-border/50 flex flex-row items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-10 h-10 flex-shrink-0">
                                                <AvatarImage src={u.profilePic} className="object-cover" />
                                                <AvatarFallback className="bg-primary/20 text-primary font-bold">{u.firstName?.[0]}{u.lastName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div><div className="font-semibold text-white">{u.firstName} {u.lastName}</div><div className="text-sm text-muted-foreground">{u.email}</div></div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-white">{u.roles?.join(", ")}</div>
                                                {u.displayRole && <div className="text-xs text-muted-foreground">{u.displayRole}</div>}
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => selectUserForEdit(u)}><Edit2 className="w-4 h-4" /></Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* PRICING PLANS */}
                    <TabsContent value="plans" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openPlanDialog()} className="gap-2"><Plus className="w-4 h-4" /> Add Plan</Button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map(plan => (
                                <Card key={plan.id} className="bg-card border-border/50 flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                                            {plan.popular && <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">Popular</span>}
                                        </div>
                                        <div className="text-2xl font-bold text-white mt-1">{plan.price} <span className="text-sm font-normal text-muted-foreground">/ {plan.period}</span></div>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-4 mb-4">
                                            <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                                            <div className="space-y-1">
                                                {plan.features?.slice(0, 3).map((f, i) => <div key={i} className="text-xs text-muted-foreground flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" />{f}</div>)}
                                                {plan.features?.length > 3 && <div className="text-xs text-muted-foreground italic">+{plan.features.length - 3} more</div>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-auto">
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => openPlanDialog(plan)}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => deleteData('pricing-plans', plan.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* SERVICES */}
                    <TabsContent value="services" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openServiceDialog()} className="gap-2"><Plus className="w-4 h-4" /> Add Service</Button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map(s => (
                                <Card key={s.id} className="bg-card border-border/50 flex flex-col">
                                    <div className={`h-1.5 bg-gradient-to-r ${s.gradient} w-full`} />
                                    <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                                        <div className={`p-2 rounded-md bg-background border border-border/50 ${s.iconColor}`}>{renderIcon(s.icon)}</div>
                                        <CardTitle className="text-lg">{s.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between pt-4">
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{s.description}</p>
                                        <div className="flex gap-2 mt-auto">
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => openServiceDialog(s)}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => deleteData('services', s.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* TESTIMONIALS */}
                    <TabsContent value="testimonials" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openTestimonialDialog()} className="gap-2"><Plus className="w-4 h-4" /> Add Testimonial</Button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map(t => (
                                <Card key={t.id} className="bg-card border-border/50 flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{t.name}</CardTitle>
                                        <CardDescription className="text-primary">{t.role}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between">
                                        <div className="mb-4">
                                            <div className="flex text-yellow-500 mb-2">
                                                {[...Array(t.rating || 5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-3 italic">"{t.content}"</p>
                                        </div>
                                        <div className="flex gap-2 mt-auto">
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => openTestimonialDialog(t)}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => deleteData('testimonials', t.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    {/* PRODUCTS */}
                    <TabsContent value="products" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openProductDialog()} className="gap-2"><Plus className="w-4 h-4" /> Add Product</Button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(p => (
                                <Card key={p.id} className="bg-card border-border/50 flex flex-col">
                                    <div className="aspect-video relative bg-muted rounded-t-lg overflow-hidden">
                                        {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{p.title}</CardTitle>
                                        <CardDescription className="text-primary">{p.price}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between">
                                        <div className="mb-4">
                                            <div className="text-xs text-muted-foreground mb-2 px-2 py-1 bg-primary/10 rounded w-fit">{p.category?.name || "Uncategorized"}</div>
                                            <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                                        </div>
                                        <div className="flex gap-2 mt-auto">
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => openProductDialog(p)}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => deleteData('products', p.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* CATEGORIES */}
                    <TabsContent value="categories" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openCategoryDialog()} className="gap-2"><Plus className="w-4 h-4" /> Add Category</Button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {categories.map(c => (
                                <Card key={c.id} className="bg-card border-border/50">
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-white">{c.name}</span>
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="ghost" onClick={() => openCategoryDialog(c)}><Edit2 className="w-3 h-3" /></Button>
                                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteData('product-categories', c.id)}><Trash2 className="w-3 h-3" /></Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    {/* SETTINGS */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card className="bg-card border-border/50">
                            <CardHeader><CardTitle>Store Configuration</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 border rounded-lg border-border/50 bg-background/20">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-white">Enable Beta Access Banner</Label>
                                        <p className="text-sm text-muted-foreground">Show the warning banner on the Store page.</p>
                                    </div>
                                    <Switch checked={settingsForm.betaEnabled} onCheckedChange={c => setSettingsForm({ ...settingsForm, betaEnabled: c })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Banner Message</Label>
                                    <Textarea
                                        value={settingsForm.betaMessage}
                                        onChange={e => setSettingsForm({ ...settingsForm, betaMessage: e.target.value })}
                                        className="min-h-[100px] bg-background/50 font-mono text-xs text-white"
                                    />
                                    <p className="text-xs text-muted-foreground">HTML is allowed. Use <code className="bg-muted/20 px-1 rounded">&lt;a&gt;</code> tags for links.</p>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg border-border/50 bg-background/20">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-white">Show Team Section</Label>
                                        <p className="text-sm text-muted-foreground">Display the "Meet Our Team" section on the About page.</p>
                                    </div>
                                    <Switch checked={settingsForm.teamSectionEnabled} onCheckedChange={c => setSettingsForm({ ...settingsForm, teamSectionEnabled: c })} />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg border-border/50 bg-background/20">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-white">Show "Buy us a Coffee"</Label>
                                        <p className="text-sm text-muted-foreground">Display the donation button in the navigation bar.</p>
                                    </div>
                                    <Switch checked={settingsForm.buyCoffeeEnabled} onCheckedChange={c => setSettingsForm({ ...settingsForm, buyCoffeeEnabled: c })} />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg border-border/50 bg-background/20">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-white">Enable Kodekernel Assistant</Label>
                                        <p className="text-sm text-muted-foreground">Display the interactive chatbot on the bottom right.</p>
                                    </div>
                                    <Switch checked={settingsForm.chatbotEnabled} onCheckedChange={c => setSettingsForm({ ...settingsForm, chatbotEnabled: c })} />
                                </div>
                                <Button onClick={saveSettings}>Save Settings</Button>
                            </CardContent>
                        </Card>

                        {/* HERO SECTION CONFIG */}
                        <Card className="bg-card border-border/50">
                            <CardHeader><CardTitle>Hero Section Configuration</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label>Badge Text</Label><Input value={settingsForm.heroBadge} onChange={e => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })} className="bg-background/50" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Title Line 1</Label><Input value={settingsForm.heroTitle1} onChange={e => setSettingsForm({ ...settingsForm, heroTitle1: e.target.value })} className="bg-background/50" /></div>
                                    <div className="space-y-2"><Label>Title Line 2 (Gradient)</Label><Input value={settingsForm.heroTitle2} onChange={e => setSettingsForm({ ...settingsForm, heroTitle2: e.target.value })} className="bg-background/50" /></div>
                                </div>
                                <div className="space-y-2"><Label>Description</Label><Textarea value={settingsForm.heroDesc} onChange={e => setSettingsForm({ ...settingsForm, heroDesc: e.target.value })} className="bg-background/50" /></div>

                                <Label>Statistics</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    {settingsForm.heroStats?.map((stat, i) => (
                                        <div key={i} className="space-y-2 border p-3 rounded-lg border-border/50 bg-background/20">
                                            <Input value={stat.value} onChange={e => {
                                                const newStats = [...settingsForm.heroStats];
                                                newStats[i].value = e.target.value;
                                                setSettingsForm({ ...settingsForm, heroStats: newStats });
                                            }} placeholder="Value (e.g. 10+)" className="bg-background/50 mb-2" />
                                            <Input value={stat.label} onChange={e => {
                                                const newStats = [...settingsForm.heroStats];
                                                newStats[i].label = e.target.value;
                                                setSettingsForm({ ...settingsForm, heroStats: newStats });
                                            }} placeholder="Label (e.g. Clients)" className="bg-background/50" />
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={saveSettings}>Save Hero Settings</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialogs reused from logic... (Plan, Service, Testimonial, User) */}
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
                <DialogContent className="bg-card text-white border-border/50 max-h-[90vh] overflow-y-auto" data-lenis-prevent>
                    <DialogHeader><DialogTitle>Plan</DialogTitle></DialogHeader>
                    <form onSubmit={handlePlanSubmit} className="space-y-4">
                        <Input value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} placeholder="Name" className="bg-background/50" />
                        <Input value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: e.target.value })} placeholder="Price" className="bg-background/50" />
                        <Input value={planForm.period} onChange={e => setPlanForm({ ...planForm, period: e.target.value })} placeholder="Period" className="bg-background/50" />
                        <Textarea value={planForm.description} onChange={e => setPlanForm({ ...planForm, description: e.target.value })} placeholder="Description" className="bg-background/50" />
                        <Textarea value={planForm.features} onChange={e => setPlanForm({ ...planForm, features: e.target.value })} placeholder="Features (lines)" className="bg-background/50" />
                        <div className="flex items-center justify-between border p-3 rounded-lg border-border/50"><Label>Popular Badge</Label><Switch checked={planForm.popular} onCheckedChange={c => setPlanForm({ ...planForm, popular: c })} /></div>
                        <Button type="submit">Save</Button>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogContent className="bg-card text-white border-border/50 max-h-[90vh] overflow-y-auto" data-lenis-prevent>
                    <DialogHeader><DialogTitle>Service</DialogTitle></DialogHeader>
                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                        <Input value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} placeholder="Title" className="bg-background/50" />
                        <Textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} placeholder="Description" className="bg-background/50" />

                        <div className="grid gap-2">
                            <Label>Icon</Label>
                            <Select value={serviceForm.icon} onValueChange={handleServiceIconChange}>
                                <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.keys(ICON_STYLES).map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label className="flex justify-between items-center">
                                Gradient Class
                                <Button type="button" size="icon" variant="ghost" className="h-4 w-4" onClick={() => setIsStyleLocked(!isStyleLocked)}>
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                            </Label>
                            <Input
                                value={serviceForm.gradient}
                                onChange={e => setServiceForm({ ...serviceForm, gradient: e.target.value })}
                                placeholder="Gradient"
                                className={`bg-background/50 ${isStyleLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                readOnly={isStyleLocked}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="flex justify-between items-center">
                                Icon Color Class
                                <Button type="button" size="icon" variant="ghost" className="h-4 w-4" onClick={() => setIsStyleLocked(!isStyleLocked)}>
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                            </Label>
                            <Input
                                value={serviceForm.iconColor}
                                onChange={e => setServiceForm({ ...serviceForm, iconColor: e.target.value })}
                                placeholder="Icon Color"
                                className={`bg-background/50 ${isStyleLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                readOnly={isStyleLocked}
                            />
                        </div>

                        <Textarea value={serviceForm.features} onChange={e => setServiceForm({ ...serviceForm, features: e.target.value })} placeholder="Features" className="bg-background/50" />
                        <Button type="submit">Save</Button>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                <DialogContent className="bg-card text-white border-border/50 max-h-[90vh] overflow-y-auto" data-lenis-prevent>
                    <DialogHeader><DialogTitle>Testimonial</DialogTitle></DialogHeader>
                    <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                        <Input value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} placeholder="Name" className="bg-background/50" />
                        <Input value={testimonialForm.role} onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} placeholder="Role" className="bg-background/50" />
                        <Textarea value={testimonialForm.content} onChange={e => setTestimonialForm({ ...testimonialForm, content: e.target.value })} placeholder="Content" className="bg-background/50" />
                        <Input type="number" value={testimonialForm.rating} onChange={e => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })} className="bg-background/50" />
                        <Button type="submit">Save</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Product Dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogContent className="bg-card text-white border-border/50 max-h-[90vh] overflow-y-auto w-full max-w-5xl" data-lenis-prevent>
                    <DialogHeader><DialogTitle>Advanced Product Lifecycle Configuration</DialogTitle></DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-10">
                        {/* Section 1: Visual & Core */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Visual & Core Registry</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="aspect-video bg-muted rounded-xl relative overflow-hidden flex items-center justify-center border border-border/50 shadow-inner group">
                                        {productForm.imageUrl ? <img src={productForm.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <span className="text-muted-foreground text-xs italic">Asset Preview Missing</span>}
                                        {uploading && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="prod-img" className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary text-center py-2.5 rounded-lg transition-all font-semibold border border-primary/20">Upload Lead Asset</Label>
                                        <input id="prod-img" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        <Input value={productForm.imageUrl} onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} placeholder="Asset URL Reference" className="bg-background/50 text-xs border-border/30" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Input value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} placeholder="Architectural Designation (Title)" className="bg-background/50 font-bold" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label className="text-[10px] uppercase font-bold text-muted-foreground">Price Unit</Label><Input value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="e.g. 499" className="bg-background/50 font-mono" /></div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Registry Class</Label>
                                            <Select value={productForm.categoryId} onValueChange={v => setProductForm({ ...productForm, categoryId: v })}>
                                                <SelectTrigger className="bg-background/50 border-border/30 h-10">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border text-white">
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5"><Label className="text-[10px] uppercase font-bold text-muted-foreground">Product Brief / Quote</Label><Textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Example: A robust, pre-engineered foundation for your next high-scale venture." className="bg-background/50 min-h-[60px]" /></div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Metadata Tags</Label>
                                        <div className="flex flex-wrap gap-1.5 p-2.5 border border-border/30 rounded-xl bg-background/30 min-h-[44px] content-start">
                                            {(productForm.tags || "").split(",").filter(t => t.trim()).map((t, i, arr) => (
                                                <div key={i} className="flex items-center gap-1.5 px-2 py-0.5 bg-muted border border-border/50 rounded text-[9px] font-bold text-muted-foreground hover:text-white transition-colors group">
                                                    {t.trim()}
                                                    <button
                                                        type="button"
                                                        className="text-muted-foreground/50 hover:text-destructive transition-colors"
                                                        onClick={() => {
                                                            const newTags = arr.filter((_, idx) => idx !== i).join(", ");
                                                            setProductForm({ ...productForm, tags: newTags });
                                                        }}
                                                    >
                                                        <LucideIcons.X className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                            ))}
                                            <Input
                                                placeholder="+ Tag"
                                                className="h-5 text-[10px] bg-transparent border-none focus-visible:ring-0 p-0 w-16"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const val = e.target.value.trim().replace(/,/g, '');
                                                        if (val) {
                                                            const current = (productForm.tags || "").split(",").filter(t => t.trim());
                                                            setProductForm({ ...productForm, tags: [...current, val].join(", ") });
                                                            e.target.value = "";
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Technical Specs & Roadmap */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Technical Specs & Documentation</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Longform Architecture (Markdown)</Label>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="md-img-upload" className="cursor-pointer text-[10px] bg-primary/20 hover:bg-primary/30 text-primary px-2 py-1 rounded transition flex items-center gap-1">
                                                <LucideIcons.Image className="w-3 h-3" /> Insert Image
                                            </Label>
                                            <input id="md-img-upload" type="file" accept="image/*" className="hidden" onChange={handleMarkdownImageUpload} />
                                        </div>
                                    </div>
                                    <div data-color-mode="dark" className="mt-2">
                                        <MDEditor
                                            value={productForm.longDescription}
                                            onChange={val => setProductForm({ ...productForm, longDescription: val })}
                                            preview="edit"
                                            height={350}
                                            className="!bg-background/20 !border-border/50 rounded-xl overflow-hidden"
                                            textareaProps={{
                                                placeholder: "Enter markdown description...",
                                                onBlur: (e) => setCursorPos(e.target.selectionStart),
                                                onKeyUp: (e) => setCursorPos(e.target.selectionStart),
                                                onClick: (e) => setCursorPos(e.target.selectionStart)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Included Features</Label>
                                        <div className="flex flex-wrap gap-2 p-3 border border-border/30 rounded-xl bg-background/30 min-h-[100px] content-start">
                                            {(productForm.features || "").split("\n").filter(f => f.trim()).map((f, i, arr) => (
                                                <div key={i} className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary group">
                                                    {f}
                                                    <button
                                                        type="button"
                                                        className="text-primary/50 hover:text-primary"
                                                        onClick={() => {
                                                            const newArr = arr.filter((_, idx) => idx !== i);
                                                            setProductForm({ ...productForm, features: newArr.join("\n") });
                                                        }}
                                                    >
                                                        <LucideIcons.X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="flex-1 min-w-[120px]">
                                                <Input
                                                    placeholder="+ New Feature"
                                                    className="h-7 text-[10px] bg-transparent border-none focus-visible:ring-0 p-0"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const val = e.target.value.trim();
                                                            if (val) {
                                                                const current = (productForm.features || "").split("\n").filter(f => f.trim());
                                                                setProductForm({ ...productForm, features: [...current, val].join("\n") });
                                                                e.target.value = "";
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">System Specifications (Key:Value)</Label>
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                            {(productForm.specs || "").split("\n").filter(l => l.includes(":")).map((line, i, arr) => {
                                                const [key, val] = line.split(":");
                                                const updateSpec = (updates) => {
                                                    const newLines = arr.map((l, idx) => {
                                                        if (idx === i) {
                                                            const k = updates.key !== undefined ? updates.key : key;
                                                            const v = updates.val !== undefined ? updates.val : val;
                                                            return `${k?.trim()}:${v?.trim()}`;
                                                        }
                                                        return l;
                                                    });
                                                    setProductForm({ ...productForm, specs: newLines.join("\n") });
                                                };
                                                const removeSpec = () => {
                                                    const newLines = arr.filter((_, idx) => idx !== i);
                                                    setProductForm({ ...productForm, specs: newLines.join("\n") });
                                                };
                                                return (
                                                    <div key={i} className="flex gap-2 items-center">
                                                        <Input placeholder="Key" value={key?.trim()} onChange={e => updateSpec({ key: e.target.value })} className="h-7 text-[10px] bg-background/50 border-border/30 w-24 font-bold" />
                                                        <Input placeholder="Value" value={val?.trim()} onChange={e => updateSpec({ val: e.target.value })} className="h-7 text-[10px] bg-background/50 border-border/30 flex-1" />
                                                        <Button type="button" variant="ghost" size="sm" onClick={removeSpec} className="h-7 w-7 p-0 text-destructive/50 hover:text-destructive"><LucideIcons.X className="w-3 h-3" /></Button>
                                                    </div>
                                                );
                                            })}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="w-full h-7 text-[9px] border border-dashed border-border/30 hover:bg-primary/5"
                                                onClick={() => {
                                                    const current = (productForm.specs || "").split("\n").filter(l => l.trim());
                                                    setProductForm({ ...productForm, specs: [...current, "Platform:Web"].join("\n") });
                                                }}
                                            >
                                                <LucideIcons.Plus className="w-3 h-3 mr-2" /> Add Specification
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: High-Density Highlights & FAQ */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Advanced Landing Sections</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Technical Highlights</Label>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {((productForm.highlights || "").split("\n").map(line => {
                                            const [icon, title, ...desc] = line.split("|");
                                            return { icon: icon?.trim() || "Zap", title: title?.trim() || "", description: desc.join("|")?.trim() || "" };
                                        }).filter(h => h.title || h.description || h.icon !== "Zap" || (productForm.highlights || "").includes(h.icon))).map((h, i, arr) => {
                                            const IconComp = LucideIcons[h.icon] || LucideIcons.Zap;
                                            const updateRow = (updates) => {
                                                const newArr = [...arr];
                                                newArr[i] = { ...newArr[i], ...updates };
                                                setProductForm({ ...productForm, highlights: newArr.filter(x => x.title || x.description).map(x => `${x.icon}|${x.title}|${x.description}`).join("\n") });
                                            };
                                            const removeRow = () => {
                                                const newArr = arr.filter((_, idx) => idx !== i);
                                                setProductForm({ ...productForm, highlights: newArr.map(x => `${x.icon}|${x.title}|${x.description}`).join("\n") });
                                            };
                                            return (
                                                <div key={i} className="flex gap-2 items-start border border-border/30 p-2.5 rounded-xl bg-background/30 hover:bg-background/50 transition-colors">
                                                    <Select value={h.icon} onValueChange={v => updateRow({ icon: v })}>
                                                        <SelectTrigger className="w-12 h-10 p-0 flex justify-center bg-card/50 border-border/50">
                                                            <IconComp className="w-4 h-4 text-primary" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-card border-border text-white">
                                                            {HIGHLIGHT_ICONS.map(name => {
                                                                const Ico = LucideIcons[name] || LucideIcons.Zap;
                                                                return <SelectItem key={name} value={name}><div className="flex items-center gap-2"><Ico className="w-4 h-4" /> <span className="text-[10px]">{name}</span></div></SelectItem>
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex-1 space-y-2">
                                                        <Input placeholder="Highlight Title" value={h.title} onChange={e => updateRow({ title: e.target.value })} className="h-7 text-[11px] font-bold bg-transparent border-border/30" />
                                                        <Input placeholder="Short Description" value={h.description} onChange={e => updateRow({ description: e.target.value })} className="h-7 text-[10px] bg-transparent border-border/30" />
                                                    </div>
                                                    <Button type="button" variant="ghost" size="sm" onClick={removeRow} className="text-destructive/50 hover:text-destructive h-7 w-7 p-0"><LucideIcons.X className="w-3 h-3" /></Button>
                                                </div>
                                            );
                                        })}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-[10px] h-9 border-dashed border-border/50 hover:bg-primary/5 hover:text-primary transition-all font-bold uppercase tracking-widest"
                                            onClick={() => {
                                                const currentHighlights = (productForm.highlights || "").split("\n").filter(l => l.trim());
                                                setProductForm({ ...productForm, highlights: [...currentHighlights, "Zap|New Highlight|Add details"].join("\n") });
                                            }}
                                        >
                                            <LucideIcons.Plus className="w-3 h-3 mr-2" /> Add Technical Highlight
                                        </Button>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-medium opacity-50">Visual Experience Configurator</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Product FAQ</Label>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {((productForm.faqs || "").split("\n").map(line => {
                                            const [q, a] = line.split("|");
                                            return { question: q?.trim() || "", answer: a?.trim() || "" };
                                        }).filter(f => f.question || f.answer)).map((f, i, arr) => {
                                            const updateRow = (updates) => {
                                                const newArr = [...arr];
                                                newArr[i] = { ...newArr[i], ...updates };
                                                setProductForm({ ...productForm, faqs: newArr.filter(x => x.question || x.answer).map(x => `${x.question}|${x.answer}`).join("\n") });
                                            };
                                            const removeRow = () => {
                                                const newArr = arr.filter((_, idx) => idx !== i);
                                                setProductForm({ ...productForm, faqs: newArr.map(x => `${x.question}|${x.answer}`).join("\n") });
                                            };
                                            return (
                                                <div key={i} className="space-y-2 border border-border/30 p-2.5 rounded-xl bg-background/30 hover:bg-background/50 transition-colors group">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-[9px] uppercase font-black text-muted-foreground/50">Entry #{i + 1}</Label>
                                                        <Button type="button" variant="ghost" size="sm" onClick={removeRow} className="text-destructive/50 hover:text-destructive h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"><LucideIcons.X className="w-3 h-3" /></Button>
                                                    </div>
                                                    <Input placeholder="Inquiry/Question" value={f.question} onChange={e => updateRow({ question: e.target.value })} className="h-8 text-[11px] font-bold bg-transparent border-border/30" />
                                                    <Textarea placeholder="Resolution/Answer" value={f.answer} onChange={e => updateRow({ answer: e.target.value })} className="min-h-[50px] text-[10px] bg-transparent border-border/30 py-2 resize-none" />
                                                </div>
                                            );
                                        })}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-[10px] h-9 border-dashed border-border/50 hover:bg-blue-500/5 hover:text-blue-400 transition-all font-bold uppercase tracking-widest"
                                            onClick={() => {
                                                const currentFaqs = (productForm.faqs || "").split("\n").filter(l => l.trim());
                                                setProductForm({ ...productForm, faqs: [...currentFaqs, "New Question|New Answer"].join("\n") });
                                            }}
                                        >
                                            <LucideIcons.Plus className="w-3 h-3 mr-2" /> Add FAQ Entry
                                        </Button>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-medium opacity-50">Support Knowledge Base Config</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Support & Procurements */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Support & Procurements</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 border p-4 rounded-xl border-border/50 bg-background/20">
                                    <Label className="text-[10px] uppercase font-bold text-primary">Support Block Config</Label>
                                    <Input value={productForm.supportTitle} onChange={e => setProductForm({ ...productForm, supportTitle: e.target.value })} placeholder="Block Title" className="bg-background/50 text-xs" />
                                    <Textarea value={productForm.supportDescription} onChange={e => setProductForm({ ...productForm, supportDescription: e.target.value })} placeholder="Support description text..." className="bg-background/50 min-h-[60px] text-xs" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input value={productForm.supportButtonText} onChange={e => setProductForm({ ...productForm, supportButtonText: e.target.value })} placeholder="Btn Text" className="bg-background/50 text-[10px]" />
                                        <Input value={productForm.supportButtonLink} onChange={e => setProductForm({ ...productForm, supportButtonLink: e.target.value })} placeholder="Btn Link" className="bg-background/50 text-[10px]" />
                                    </div>
                                </div>
                                <div className="space-y-4 border p-4 rounded-xl border-border/50 bg-background/20">
                                    <Label className="text-[10px] uppercase font-bold text-primary">Call to Action (CTA)</Label>
                                    <Input value={productForm.buttonText} onChange={e => setProductForm({ ...productForm, buttonText: e.target.value })} placeholder="Execute Acquisition" className="bg-background/50 font-bold" />
                                    <Input value={productForm.buttonLink} onChange={e => setProductForm({ ...productForm, buttonLink: e.target.value })} placeholder="Procurement Route (URL)" className="bg-background/50 text-xs" />

                                    <div className="space-y-4 pt-4 border-t border-border/30 mt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Show Delivery Note</Label>
                                                <p className="text-[9px] text-muted-foreground leading-none">Show "Instant delivery" text under button</p>
                                            </div>
                                            <Switch
                                                checked={productForm.showDeliveryBadge}
                                                onCheckedChange={c => setProductForm({ ...productForm, showDeliveryBadge: c })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-[10px] uppercase font-bold text-yellow-500">In-Page Notification Banner</Label>
                                                    <p className="text-[9px] text-muted-foreground leading-none">Enable a high-visibility info banner</p>
                                                </div>
                                                <Switch
                                                    checked={productForm.betaBannerEnabled}
                                                    onCheckedChange={c => setProductForm({ ...productForm, betaBannerEnabled: c })}
                                                />
                                            </div>
                                            {productForm.betaBannerEnabled && (
                                                <div className="space-y-1.5 focus-within:animate-pulse">
                                                    <Input
                                                        value={productForm.betaBannerMessage}
                                                        onChange={e => setProductForm({ ...productForm, betaBannerMessage: e.target.value })}
                                                        placeholder="e.g. Beta Access: Contact us for custom integration..."
                                                        className="h-8 text-[11px] bg-yellow-500/5 border-yellow-500/20 text-yellow-500 placeholder:text-yellow-500/30"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <Button type="button" variant="ghost" className="flex-1 border border-border/50 hover:bg-muted/50" onClick={() => setIsProductDialogOpen(false)}>Discard Registry Delta</Button>
                            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 font-black uppercase tracking-widest shadow-lg shadow-primary/20">Commit to Product Registry</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* User Config Dialog */}
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogContent className="bg-card text-white border-border/50" data-lenis-prevent>
                    <DialogHeader><DialogTitle>Configure User</DialogTitle></DialogHeader>
                    <form onSubmit={handleUserSubmit} className="space-y-6">
                        {/* Profile Pic Upload */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-border/50 bg-muted">
                                {userForm.profilePic ? <img src={userForm.profilePic} alt="Profile" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Pic</div>}
                                {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="animate-spin w-4 h-4" /></div>}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="user-img-upload" className="cursor-pointer bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded transition inline-block text-sm">Upload Profile Picture</Label>
                                <input id="user-img-upload" type="file" accept="image/*" className="hidden" onChange={handleUserImageUpload} />
                                <Input value={userForm.profilePic || ""} onChange={e => setUserForm({ ...userForm, profilePic: e.target.value })} placeholder="Or Image URL" className="bg-background/50 text-xs" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="flex justify-between items-center mb-1">
                                System Roles
                                <Button type="button" size="sm" variant="ghost" onClick={() => setIsRoleDialogOpen(true)} className="h-6 text-xs text-primary hover:text-primary">
                                    + New Role
                                </Button>
                            </Label>
                            <div className="grid grid-cols-2 gap-3 bg-background/20 p-4 rounded-lg border border-border/50">
                                {availableRoles.map(r => (
                                    <label key={r.id} className="flex items-center space-x-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={userForm.roles?.includes(r.name)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                const currentRoles = userForm.roles || [];
                                                let newRoles;
                                                if (checked) newRoles = [...currentRoles, r.name];
                                                else newRoles = currentRoles.filter(role => role !== r.name);
                                                setUserForm({ ...userForm, roles: newRoles });
                                            }}
                                            className="w-4 h-4 rounded border-gray-500 bg-transparent text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">{r.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Team Page Display Role</Label>
                            <Input value={userForm.displayRole || ""} onChange={e => setUserForm({ ...userForm, displayRole: e.target.value })} placeholder="e.g. CEO & Founder" className="bg-background/50" />
                        </div>
                        <div className="flex items-center justify-between border p-4 rounded-lg border-border/50 bg-background/50">
                            <div className="space-y-0.5">
                                <Label>Show on Team Page</Label>
                                <div className="text-sm text-muted-foreground">User will be visible in "Meet Our Team" section</div>
                            </div>
                            <Switch checked={userForm.showOnTeam} onCheckedChange={c => setUserForm({ ...userForm, showOnTeam: c })} />
                        </div>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add Role Dialog */}
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent className="bg-card text-white border-border/50">
                    <DialogHeader><DialogTitle>Add New Role</DialogTitle></DialogHeader>
                    <form onSubmit={handleCreateRole} className="space-y-4">
                        <Input
                            value={newRoleName}
                            onChange={e => setNewRoleName(e.target.value)}
                            placeholder="Role Name (e.g. MANAGER)"
                            className="bg-background/50 uppercase"
                        />
                        <Button type="submit" disabled={!newRoleName.trim()}>Add Role</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className="bg-card text-white border-border/50">
                    <DialogHeader><DialogTitle>{editingId ? "Edit Category" : "New Category"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Category Name</Label>
                            <Input value={categoryForm.name} onChange={e => setCategoryForm({ name: e.target.value })} placeholder="e.g. Web App" className="bg-background/50" />
                        </div>
                        <Button type="submit" className="w-full">Save Category</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}
