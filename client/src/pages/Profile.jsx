import { useEffect } from "react";
import { useLocation } from "wouter";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [_, setLocation] = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            setLocation("/login");
        }
    }, [isAuthenticated, setLocation]);

    if (!isAuthenticated || !user) {
        return null;
    }

    // Country code to phone prefix mapping
    const countryCodeMap = {
        US: '+1', CA: '+1', UK: '+44', AU: '+61', IN: '+91', JP: '+81', CN: '+86',
        DE: '+49', FR: '+33', IT: '+39', BR: '+55', RU: '+7', KR: '+82', ES: '+34',
        NL: '+31', TR: '+90', CH: '+41', SE: '+46', SG: '+65', UAE: '+971', EG: '+20',
        ZA: '+27', GR: '+30', BE: '+32', HU: '+36', RO: '+40', AT: '+43', DK: '+45',
        NO: '+47', PL: '+48', PE: '+51', MX: '+52', CU: '+53', AR: '+54', CL: '+56',
        CO: '+57', VE: '+58', MY: '+60', ID: '+62', PH: '+63', NZ: '+64', TH: '+66',
        VN: '+84', PK: '+92', AF: '+93', LK: '+94', MM: '+95', IR: '+98', MA: '+212',
        DZ: '+213', TN: '+216', LY: '+218', GM: '+220', SN: '+221', GH: '+233',
        NG: '+234', KE: '+254', TZ: '+255', UG: '+256', ZM: '+260', ZW: '+263',
        PT: '+351', LU: '+352', IE: '+353', IS: '+354', AL: '+355', MT: '+356',
        CY: '+357', FI: '+358', BG: '+359', LT: '+370', LV: '+371', EE: '+372',
        UA: '+380', RS: '+381', HR: '+385', SI: '+386', CZ: '+420', SK: '+421',
        GT: '+502', SV: '+503', HN: '+504', NI: '+505', CR: '+506', PA: '+507',
        BO: '+591', EC: '+593', PY: '+595', UY: '+598', HK: '+852', KH: '+855',
        BD: '+880', LB: '+961', JO: '+962', SY: '+963', IQ: '+964', KW: '+965',
        SA: '+966', OM: '+968', IL: '+972', BH: '+973', QA: '+974'
    };

    const getPhoneWithCode = () => {
        if (!user.phone) return "Not provided";
        const countryCode = user.country ? countryCodeMap[user.country] : null;
        return countryCode ? `${countryCode} ${user.phone}` : user.phone;
    };

    const userDetails = [
        {
            icon: <Mail className="w-5 h-5 text-primary" />,
            label: "Email",
            value: user.sub || user.email,
        },
        {
            icon: <Phone className="w-5 h-5 text-primary" />,
            label: "Phone",
            value: getPhoneWithCode(),
        },
        {
            icon: <Globe className="w-5 h-5 text-primary" />,
            label: "Country",
            value: user.country || "Not provided",
        },
        {
            icon: <Shield className="w-5 h-5 text-primary" />,
            label: "Role",
            value: user.role,
        },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-8 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[70rem] h-[70rem] bg-primary/5 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute top-[40%] -left-[10%] w-[60rem] h-[60rem] bg-accent/5 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            Profile
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Manage your personal information and account settings
                        </p>
                    </div>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <CardHeader className="text-center pb-8 border-b border-border/50">
                            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-2 ring-primary/20 ring-offset-2 ring-offset-background shadow-lg shadow-primary/5">
                                <User className="w-12 h-12 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">
                                {user.firstName} {user.lastName}
                            </CardTitle>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                    {user.role || 'USER'}
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userDetails.map((detail, index) => (
                                    <motion.div
                                        key={detail.label}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 rounded-xl bg-background/40 border border-border/50 hover:bg-accent/5 hover:border-accent/20 transition-all duration-300 group/item"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-background/60 shadow-sm group-hover/item:scale-110 transition-transform duration-300">
                                                {detail.icon}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {detail.label}
                                                </p>
                                                <p className="text-base font-semibold text-foreground break-all">
                                                    {detail.value}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-center pt-6 border-t border-border/50">
                                <Button
                                    variant="outline"
                                    className="min-w-[150px] border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
