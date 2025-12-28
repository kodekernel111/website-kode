import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MVPShowcase from "@/components/MVPShowcase";
import Chatbot from "@/components/Chatbot";

export default function Projects() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="pt-16">
                <MVPShowcase />
            </div>
            <Footer />
            <Chatbot />
        </div>
    );
}
