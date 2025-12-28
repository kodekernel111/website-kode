import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Globe, Shield, Edit2, Loader2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { setCredentials } from "@/store/authSlice";

export default function Profile() {
    const { user, isAuthenticated, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [_, setLocation] = useLocation();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("image", file);

        setUploading(true);
        try {
            const res = await fetch("http://localhost:8080/api/upload/image", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: uploadData
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setFormData(prev => ({ ...prev, profilePic: data.url }));
            toast({ title: "Success", description: "Image uploaded" });
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setLocation("/login");
        } else if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
                country: user.country || "",
                bio: user.bio || "",
                displayRole: user.displayRole || "",
                profilePic: user.profilePic || ""
            });
        }
    }, [isAuthenticated, user, setLocation]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Update failed");

            const updatedUser = await res.json();
            dispatch(setCredentials({ user: updatedUser, token }));
            toast({ title: "Profile Updated", description: "Your details have been saved." });
            setIsEditing(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    email: user.sub || user.email,
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (!res.ok) {
                const err = await res.json(); // Try to parse error
                throw new Error(err.message || "Failed to change password");
            }

            toast({ title: "Success", description: "Password changed successfully." });
            setIsChangingPassword(false);
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            // Check if error is JSON (from catch above) or just message or text
            console.error(error);
            toast({ title: "Error", description: error.message || "Incorrect old password or server error", variant: "destructive" });
        }
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    // Country code to phone mapping (simplified for brevity or reused)
    const renderPhone = () => user.phone || "Not provided";

    const userDetails = [
        { icon: <Mail className="w-5 h-5 text-primary" />, label: "Email", value: user.sub || user.email },
        { icon: <Phone className="w-5 h-5 text-primary" />, label: "Phone", value: renderPhone() },
        { icon: <Globe className="w-5 h-5 text-primary" />, label: "Country", value: user.country || "Not provided" },
        { icon: <Shield className="w-5 h-5 text-primary" />, label: "Role", value: user.roles?.join(", ") || user.role || "USER" },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-8 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[70rem] h-[70rem] bg-primary/5 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute top-[40%] -left-[10%] w-[60rem] h-[60rem] bg-accent/5 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Profile</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Manage your personal information and account settings</p>
                    </div>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <CardHeader className="text-center pb-8 border-b border-border/50">
                            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-2 ring-primary/20 ring-offset-2 ring-offset-background shadow-lg shadow-primary/5 overflow-hidden">
                                {user.profilePic ? <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-primary" />}
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</CardTitle>

                            {user.displayRole && <div className="text-sm text-primary/80 font-medium tracking-wide uppercase mt-1">{user.displayRole}</div>}

                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                    {user.roles?.join(" | ") || user.role || 'USER'}
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userDetails.map((detail, index) => (
                                    <motion.div key={detail.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-xl bg-background/40 border border-border/50 hover:bg-accent/5 hover:border-accent/20 transition-all duration-300 group/item">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-background/60 shadow-sm group-hover/item:scale-110 transition-transform duration-300">{detail.icon}</div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
                                                <p className="text-base font-semibold text-foreground break-all">{detail.value}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {user.bio && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 rounded-xl bg-background/30 border border-border/50 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center justify-center gap-2">About Me</h3>
                                    <p className="text-lg text-white/90 italic leading-relaxed">"{user.bio}"</p>
                                </motion.div>
                            )}

                            <div className="mt-8 flex justify-center gap-4 pt-6 border-t border-border/50">
                                <Button variant="outline" onClick={() => setIsEditing(true)} className="min-w-[150px] border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300 gap-2">
                                    <Edit2 className="w-4 h-4" /> Edit Profile
                                </Button>
                                <Button variant="outline" onClick={() => setIsChangingPassword(true)} className="min-w-[150px] border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300 gap-2">
                                    <Shield className="w-4 h-4" /> Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="bg-card text-white border-border/50 max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4 py-2">
                        <div className="space-y-4 text-center">
                            <Label>Profile Picture</Label>
                            <div className="w-24 h-24 mx-auto rounded-full bg-muted relative overflow-hidden flex items-center justify-center border-2 border-dashed border-border/50">
                                {formData.profilePic ? (
                                    <img src={formData.profilePic} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-muted-foreground" />
                                )}
                                {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="animate-spin w-6 h-6 text-white" /></div>}
                            </div>
                            <div className="flex justify-center">
                                <Label htmlFor="upload-avatar" className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition text-sm font-medium flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> Upload Picture
                                </Label>
                                <Input id="upload-avatar" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                className="bg-background/50 min-h-[150px]"
                            />
                            <p className="text-xs text-muted-foreground">This bio will be displayed on your blog posts.</p>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit">Save Bio</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                <DialogContent className="bg-card text-white border-border/50">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                required
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                                minLength={8}
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                required
                                minLength={8}
                                className="bg-background/50"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                            <Button type="submit">Update Password</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
