import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

export default function Logout() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("authChange"));
        toast({
            title: "Logged out",
            description: "You have been logged out successfully.",
        });
        setLocation("/");
    }, [setLocation, toast]);

    return (
        <div className="pt-24 min-h-screen bg-background flex flex-col justify-between">
            <div className="flex-grow flex items-center justify-center">
                <p className="text-lg text-muted-foreground">Logging out...</p>
            </div>
            <Footer />
        </div>
    );
}
