import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { isValidPhoneNumber, getExampleNumber, AsYouType } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';

const COUNTRY_CODES = [
    { code: "+1", flag: "🇺🇸", label: "US", name: "United States" },
    { code: "+1", flag: "🇨🇦", label: "CA", name: "Canada" },
    { code: "+44", flag: "🇬🇧", label: "UK", name: "United Kingdom" },
    { code: "+61", flag: "🇦🇺", label: "AU", name: "Australia" },
    { code: "+91", flag: "🇮🇳", label: "IN", name: "India" },
    { code: "+81", flag: "🇯🇵", label: "JP", name: "Japan" },
    { code: "+86", flag: "🇨🇳", label: "CN", name: "China" },
    { code: "+49", flag: "🇩🇪", label: "DE", name: "Germany" },
    { code: "+33", flag: "🇫🇷", label: "FR", name: "France" },
    { code: "+39", flag: "🇮🇹", label: "IT", name: "Italy" },
    { code: "+55", flag: "🇧🇷", label: "BR", name: "Brazil" },
    { code: "+7", flag: "🇷🇺", label: "RU", name: "Russia" },
    { code: "+82", flag: "🇰🇷", label: "KR", name: "South Korea" },
    { code: "+34", flag: "🇪🇸", label: "ES", name: "Spain" },
    { code: "+31", flag: "🇳🇱", label: "NL", name: "Netherlands" },
    { code: "+90", flag: "🇹🇷", label: "TR", name: "Turkey" },
    { code: "+41", flag: "🇨🇭", label: "CH", name: "Switzerland" },
    { code: "+46", flag: "🇸🇪", label: "SE", name: "Sweden" },
    { code: "+65", flag: "🇸🇬", label: "SG", name: "Singapore" },
    { code: "+971", flag: "🇦🇪", label: "UAE", name: "United Arab Emirates" },
    { code: "+20", flag: "🇪🇬", label: "EG", name: "Egypt" },
    { code: "+27", flag: "🇿🇦", label: "ZA", name: "South Africa" },
    { code: "+30", flag: "🇬🇷", label: "GR", name: "Greece" },
    { code: "+32", flag: "🇧🇪", label: "BE", name: "Belgium" },
    { code: "+36", flag: "🇭🇺", label: "HU", name: "Hungary" },
    { code: "+40", flag: "🇷🇴", label: "RO", name: "Romania" },
    { code: "+43", flag: "🇦🇹", label: "AT", name: "Austria" },
    { code: "+45", flag: "🇩🇰", label: "DK", name: "Denmark" },
    { code: "+47", flag: "🇳🇴", label: "NO", name: "Norway" },
    { code: "+48", flag: "🇵🇱", label: "PL", name: "Poland" },
    { code: "+51", flag: "🇵🇪", label: "PE", name: "Peru" },
    { code: "+52", flag: "🇲🇽", label: "MX", name: "Mexico" },
    { code: "+53", flag: "🇨🇺", label: "CU", name: "Cuba" },
    { code: "+54", flag: "🇦🇷", label: "AR", name: "Argentina" },
    { code: "+56", flag: "🇨🇱", label: "CL", name: "Chile" },
    { code: "+57", flag: "🇨🇴", label: "CO", name: "Colombia" },
    { code: "+58", flag: "🇻🇪", label: "VE", name: "Venezuela" },
    { code: "+60", flag: "🇲🇾", label: "MY", name: "Malaysia" },
    { code: "+62", flag: "🇮🇩", label: "ID", name: "Indonesia" },
    { code: "+63", flag: "🇵🇭", label: "PH", name: "Philippines" },
    { code: "+64", flag: "🇳🇿", label: "NZ", name: "New Zealand" },
    { code: "+66", flag: "🇹🇭", label: "TH", name: "Thailand" },
    { code: "+84", flag: "🇻🇳", label: "VN", name: "Vietnam" },
    { code: "+92", flag: "🇵🇰", label: "PK", name: "Pakistan" },
    { code: "+93", flag: "🇦🇫", label: "AF", name: "Afghanistan" },
    { code: "+94", flag: "🇱🇰", label: "LK", name: "Sri Lanka" },
    { code: "+95", flag: "🇲🇲", label: "MM", name: "Myanmar" },
    { code: "+98", flag: "🇮🇷", label: "IR", name: "Iran" },
    { code: "+212", flag: "🇲🇦", label: "MA", name: "Morocco" },
    { code: "+213", flag: "🇩🇿", label: "DZ", name: "Algeria" },
    { code: "+216", flag: "🇹🇳", label: "TN", name: "Tunisia" },
    { code: "+218", flag: "🇱🇾", label: "LY", name: "Libya" },
    { code: "+220", flag: "🇬🇲", label: "GM", name: "Gambia" },
    { code: "+221", flag: "🇸🇳", label: "SN", name: "Senegal" },
    { code: "+233", flag: "🇬🇭", label: "GH", name: "Ghana" },
    { code: "+234", flag: "🇳🇬", label: "NG", name: "Nigeria" },
    { code: "+254", flag: "🇰🇪", label: "KE", name: "Kenya" },
    { code: "+255", flag: "🇹🇿", label: "TZ", name: "Tanzania" },
    { code: "+256", flag: "🇺🇬", label: "UG", name: "Uganda" },
    { code: "+260", flag: "🇿🇲", label: "ZM", name: "Zambia" },
    { code: "+263", flag: "🇿🇼", label: "ZW", name: "Zimbabwe" },
    { code: "+351", flag: "🇵🇹", label: "PT", name: "Portugal" },
    { code: "+352", flag: "🇱🇺", label: "LU", name: "Luxembourg" },
    { code: "+353", flag: "🇮🇪", label: "IE", name: "Ireland" },
    { code: "+354", flag: "🇮🇸", label: "IS", name: "Iceland" },
    { code: "+355", flag: "🇦🇱", label: "AL", name: "Albania" },
    { code: "+356", flag: "🇲🇹", label: "MT", name: "Malta" },
    { code: "+357", flag: "🇨🇾", label: "CY", name: "Cyprus" },
    { code: "+358", flag: "🇫🇮", label: "FI", name: "Finland" },
    { code: "+359", flag: "🇧🇬", label: "BG", name: "Bulgaria" },
    { code: "+370", flag: "🇱Ｔ", label: "LT", name: "Lithuania" },
    { code: "+371", flag: "🇱🇻", label: "LV", name: "Latvia" },
    { code: "+372", flag: "🇪🇪", label: "EE", name: "Estonia" },
    { code: "+380", flag: "🇺🇦", label: "UA", name: "Ukraine" },
    { code: "+381", flag: "🇷🇸", label: "RS", name: "Serbia" },
    { code: "+385", flag: "🇭🇷", label: "HR", name: "Croatia" },
    { code: "+386", flag: "🇸🇮", label: "SI", name: "Slovenia" },
    { code: "+420", flag: "🇨🇿", label: "CZ", name: "Czech Republic" },
    { code: "+421", flag: "🇸🇰", label: "SK", name: "Slovakia" },
    { code: "+502", flag: "🇬🇹", label: "GT", name: "Guatemala" },
    { code: "+503", flag: "🇸🇻", label: "SV", name: "El Salvador" },
    { code: "+504", flag: "🇭🇳", label: "HN", name: "Honduras" },
    { code: "+505", flag: "🇳🇮", label: "NI", name: "Nicaragua" },
    { code: "+506", flag: "🇨🇷", label: "CR", name: "Costa Rica" },
    { code: "+507", flag: "🇵🇦", label: "PA", name: "Panama" },
    { code: "+591", flag: "🇧🇴", label: "BO", name: "Bolivia" },
    { code: "+593", flag: "🇪🇨", label: "EC", name: "Ecuador" },
    { code: "+595", flag: "🇵🇾", label: "PY", name: "Paraguay" },
    { code: "+598", flag: "🇺🇾", label: "UY", name: "Uruguay" },
    { code: "+852", flag: "🇭🇰", label: "HK", name: "Hong Kong" },
    { code: "+855", flag: "🇰🇭", label: "KH", name: "Cambodia" },
    { code: "+880", flag: "🇧🇩", label: "BD", name: "Bangladesh" },
    { code: "+961", flag: "🇱🇧", label: "LB", name: "Lebanon" },
    { code: "+962", flag: "🇯🇴", label: "JO", name: "Jordan" },
    { code: "+963", flag: "🇸🇾", label: "SY", name: "Syria" },
    { code: "+964", flag: "🇮🇶", label: "IQ", name: "Iraq" },
    { code: "+965", flag: "🇰🇼", label: "KW", name: "Kuwait" },
    { code: "+966", flag: "🇸🇦", label: "SA", name: "Saudi Arabia" },
    { code: "+968", flag: "🇴🇲", label: "OM", name: "Oman" },
    { code: "+972", flag: "🇮🇱", label: "IL", name: "Israel" },
    { code: "+973", flag: "🇧🇭", label: "BH", name: "Bahrain" },
    { code: "+974", flag: "🇶🇦", label: "QA", name: "Qatar" }
].sort((a, b) => a.name.localeCompare(b.name));

const signupSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    country: z.string({ required_error: "Please select a country" }),
    phone: z.string(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).superRefine((data, ctx) => {
    if (data.phone && data.country) {
        if (!isValidPhoneNumber(data.phone, data.country)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid phone number for the selected country",
                path: ["phone"],
            });
        }
    } else if (!data.phone) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Phone number is required",
            path: ["phone"],
        });
    }
});

export default function Signup() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            country: "US", // Default to US
            password: "",
            confirmPassword: "",
        },
    });

    const selectedCountry = form.watch("country");
    const password = form.watch("password");

    const phonePlaceholder = useMemo(() => {
        if (selectedCountry) {
            const example = getExampleNumber(selectedCountry, examples);
            return example ? example.formatNational() : "123 456 7890";
        }
        return "123 456 7890";
    }, [selectedCountry]);

    useEffect(() => {
        if (isAuthenticated) {
            setLocation("/");
        }
    }, [isAuthenticated, setLocation]);

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error,
            });
        }
    }, [error, toast]);

    const onSubmit = (data) => {
        const userData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            country: data.country,
            password: data.password,
            // role: "USER" // Optional, backend defaults to User
        };
        dispatch(registerUser(userData));
    };

    return (
        <div className="pt-24 min-h-screen bg-background flex flex-col">
            <AnimatedSection className="container mx-auto px-4 flex justify-center flex-grow items-center">
                <Card className="w-full max-w-lg my-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your information to get started
                        </CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Jacob" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Michaels" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="name@emailprovider.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-2">
                                    <FormLabel>Phone Number</FormLabel>
                                    <div className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <Popover open={open} onOpenChange={setOpen}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    aria-expanded={open}
                                                                    className={cn(
                                                                        "w-[140px] justify-between px-3",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        (() => {
                                                                            const c = COUNTRY_CODES.find((c) => c.label === field.value);
                                                                            return c ? (
                                                                                <>
                                                                                    <span className="mr-2">{c.flag}</span>
                                                                                    {c.code}
                                                                                </>
                                                                            ) : "Select";
                                                                        })()
                                                                    ) : (
                                                                        "Select code"
                                                                    )}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[200px] p-0" align="start">
                                                            <Command>
                                                                <CommandInput placeholder="Search country..." />
                                                                <CommandList>
                                                                    <CommandEmpty>No country found.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {COUNTRY_CODES.map((item) => (
                                                                            <CommandItem
                                                                                key={item.label}
                                                                                value={item.name}
                                                                                onSelect={() => {
                                                                                    form.setValue("country", item.label);
                                                                                    setOpen(false);
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        field.value === item.label ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                <span className="mr-2">{item.flag}</span>
                                                                                {item.name} ({item.code})
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            type="tel"
                                                            placeholder={phonePlaceholder}
                                                            {...field}
                                                            onChange={(e) => {
                                                                const rawValue = e.target.value;
                                                                const formattedValue = new AsYouType(selectedCountry).input(rawValue);
                                                                field.onChange(formattedValue);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Password must contain:
                                                <ul className="space-y-1 mt-1">
                                                    {[
                                                        { label: "At least 8 characters", valid: password?.length >= 8 },
                                                        { label: "At least one uppercase letter", valid: /[A-Z]/.test(password || "") },
                                                        { label: "At least one lowercase letter", valid: /[a-z]/.test(password || "") },
                                                        { label: "At least one number", valid: /[0-9]/.test(password || "") },
                                                        { label: "At least one special character", valid: /[^A-Za-z0-9]/.test(password || "") },
                                                    ].map((req, index) => (
                                                        <li key={index} className={cn("text-xs flex items-center gap-2", req.valid ? "text-green-500" : "text-muted-foreground")}>
                                                            {req.valid ? <Check className="h-3 w-3" /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 mx-0.5" />}
                                                            {req.valid ? req.label : <span className={req.valid ? "" : ""}>{req.label}</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary" disabled={loading}>
                                    {loading ? "Creating account..." : "Create account"}
                                </Button>
                                <div className="text-center text-sm text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link href="/login" className="font-semibold text-primary hover:underline">
                                        Sign in
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </AnimatedSection>
            <Footer />
        </div>
    );
}
