import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32">
        <ContactForm />
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
