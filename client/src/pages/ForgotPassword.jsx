import { useState } from "react";
import { Link } from "wouter";
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

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPassword() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed to send reset email");

            toast({
                title: "Check your email",
                description: "If an account exists for " + data.email + ", we have sent a password reset link.",
            });
            form.reset();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
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
                        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name@emailprovider.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary" disabled={loading}>
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </Button>
                                <div className="text-center text-sm text-muted-foreground">
                                    Remember your password?{" "}
                                    <Link href="/login" className="font-semibold text-primary hover:underline">
                                        Back to login
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
