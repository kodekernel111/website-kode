import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <p className="mb-6 text-muted-foreground text-sm">
          Last updated: November 16, 2025
        </p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="text-sm mb-2">
            By accessing or using our website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use our services.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. Use of Services</h2>
          <p className="text-sm mb-2">
            You may use our website and services only for lawful purposes and in accordance with these Terms. You agree not to use our services for any illegal or unauthorized purpose.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
          <p className="text-sm mb-2">
            All content, trademarks, and intellectual property on this website are owned by Kodekernel or its licensors. You may not copy, reproduce, or distribute any content without our written permission.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. User Content</h2>
          <p className="text-sm mb-2">
            You retain ownership of any content you submit, but you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with our services.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Disclaimers</h2>
          <p className="text-sm mb-2">
            Our services are provided "as is" and "as available" without warranties of any kind. We do not guarantee that our services will be uninterrupted, secure, or error-free.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
          <p className="text-sm mb-2">
            To the fullest extent permitted by law, Kodekernel and its affiliates shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. Governing Law</h2>
          <p className="text-sm mb-2">
            These Terms are governed by the laws of the jurisdiction in which Kodekernel operates, without regard to conflict of law principles. Users from other countries are responsible for compliance with local laws.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
          <p className="text-sm mb-2">
            We may update these Terms from time to time. Continued use of our services after changes constitutes acceptance of the new Terms.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p className="text-sm mb-2">
            If you have any questions about these Terms, please contact us at support@kodekernel.com.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
