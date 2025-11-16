import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="mb-6 text-muted-foreground text-sm">
          Last updated: November 16, 2025
        </p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-sm mb-2">
            This Privacy Policy explains how Kodekernel collects, uses, and protects your information when you use our website and services. By using our services, you consent to the practices described in this policy.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <p className="text-sm mb-2">
            We may collect personal information you provide (such as name, email, payment details) and technical data (such as IP address, browser type, and usage data) to improve our services.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Information</h2>
          <p className="text-sm mb-2">
            We use your information to provide, maintain, and improve our services, communicate with you, process payments, and comply with legal obligations.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Sharing of Information</h2>
          <p className="text-sm mb-2">
            We do not sell your personal information. We may share information with trusted third parties who assist us in operating our services, as required by law, or to protect our rights.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. International Users</h2>
          <p className="text-sm mb-2">
            Our services are accessible worldwide. By using our services, you consent to the transfer and processing of your information in countries where we or our service providers operate.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
          <p className="text-sm mb-2">
            We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. Children's Privacy</h2>
          <p className="text-sm mb-2">
            Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p className="text-sm mb-2">
            We may update this Privacy Policy from time to time. Continued use of our services after changes constitutes acceptance of the new policy.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p className="text-sm mb-2">
            If you have any questions about this Privacy Policy, please contact us at support@kodekernel.com.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
