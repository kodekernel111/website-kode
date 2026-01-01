import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";

export default function Logout() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logout()); // Clear Redux state and localStorage
        toast({
            title: "Logged out",
            description: "You have been logged out successfully.",
        });
        setLocation("/login"); // Redirect to Login page
    }, [setLocation, toast, dispatch]);

    return (
        <div className="pt-24 min-h-screen bg-background flex flex-col justify-between">
            <div className="flex-grow flex items-center justify-center">
                <p className="text-lg text-muted-foreground">Logging out...</p>
            </div>
            <Footer />
        </div>
    );
}
