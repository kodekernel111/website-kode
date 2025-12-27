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
import {
    Plus, Trash2, Edit2, Star, User as UserIcon, Search, Loader2, X,
    Code, Palette, Smartphone, Rocket, BarChart
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

    // Data States
    const [plans, setPlans] = useState([]);
    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);

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
    const [userForm, setUserForm] = useState({
        role: "USER", displayRole: "", showOnTeam: false
    });

    useEffect(() => {
        if (!isAuthenticated || user?.role !== "ADMIN") return;
        fetchData();
        fetchTeamMembers();
    }, [isAuthenticated, user, token]);

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

    const fetchData = async () => {
        try {
            const [plansRes, servicesRes, testimonialsRes] = await Promise.all([
                fetch("http://localhost:8080/api/pricing-plans"),
                fetch("http://localhost:8080/api/services"),
                fetch("http://localhost:8080/api/testimonials")
            ]);

            if (plansRes.ok) setPlans(await plansRes.json());
            if (servicesRes.ok) setServices(await servicesRes.json());
            if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
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

    // --- User Handlers ---
    const selectUserForEdit = (u) => {
        setEditingId(u.id);
        setUserForm({ role: u.role, displayRole: u.displayRole || "", showOnTeam: u.showOnTeam });
        setSearchQuery("");
        setShowSuggestions(false);
        setIsUserDialogOpen(true);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        await submitData("users", editingId, userForm, setIsUserDialogOpen);
        fetchTeamMembers();
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

    if (!isAuthenticated || user?.role !== "ADMIN") return <div className="min-h-screen pt-32 text-center text-white"><Navigation /><h1>Access Denied</h1><Footer /></div>;

    return (
        <div className="min-h-screen bg-background text-white">
            <Navigation />
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Admin Controls</h1>

                <Tabs defaultValue="users" className="space-y-6">
                    <TabsList className="bg-card border border-border/50">
                        <TabsTrigger value="users">Users & Team</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
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
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{u.firstName?.[0]}{u.lastName?.[0]}</div>
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
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                                            <div><div className="font-semibold text-white">{u.firstName} {u.lastName}</div><div className="text-sm text-muted-foreground">{u.email}</div></div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-white">{u.role}</div>
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
                    <TabsContent value="pricing" className="space-y-4">
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
                </Tabs>
            </div>

            {/* Dialogs reused from logic... (Plan, Service, Testimonial, User) */}
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
                <DialogContent className="bg-card text-white border-border/50 max-h-[90vh] overflow-y-auto">
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
                <DialogContent className="bg-card text-white border-border/50 max-h-[90vh] overflow-y-auto">
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
                <DialogContent className="bg-card text-white border-border/50 max-h-[90vh] overflow-y-auto">
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

            {/* User Config Dialog */}
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogContent className="bg-card text-white border-border/50">
                    <DialogHeader><DialogTitle>Configure User</DialogTitle></DialogHeader>
                    <form onSubmit={handleUserSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label>System Role</Label>
                            <Select value={userForm.role} onValueChange={v => setUserForm({ ...userForm, role: v })}>
                                <SelectTrigger className="bg-background/50 border-input"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="WRITER">Writer</SelectItem>
                                    <SelectItem value="USER">User</SelectItem>
                                </SelectContent>
                            </Select>
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

            <Footer />
        </div>
    );
}
