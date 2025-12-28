import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/form";

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function ResetPassword() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [, setLocation] = useLocation();

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get("token");

            if (!token) {
                toast({ title: "Error", description: "Invalid or missing reset token.", variant: "destructive" });
                return;
            }

            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: data.password }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to reset password");
            }

            toast({
                title: "Success",
                description: "Your password has been reset. You can now login.",
            });
            setLocation("/login");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-background flex flex-col">
            <AnimatedSection className="container mx-auto px-4 flex justify-center flex-grow items-center">
                <Card className="w-full max-w-md my-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your new password below.
                        </CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
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
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary" disabled={loading}>
                                    {loading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </AnimatedSection>
            <Footer />
        </div>
    );
}
