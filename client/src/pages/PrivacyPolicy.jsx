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
          <h2 className="text-xl font-semibold mb-4 text-primary">1. Introduction</h2>
          <p className="text-sm mb-4 leading-relaxed">
            Welcome to Kodekernel ("Company", "we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>
          <p className="text-sm mb-2 leading-relaxed">
            By accessing or using our website and services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">2. Information We Collect</h2>
          <p className="text-sm mb-4">We collect several different types of information for various purposes to provide and improve our Service to you:</p>
          <ul className="list-disc list-inside text-sm space-y-2 ml-4 mb-4 text-muted-foreground">
            <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include Email address, First name and Last name, Phone number, Address, State, Province, ZIP/Postal code, City.</li>
            <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
            <li><strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">3. Use of Data</h2>
          <p className="text-sm mb-4">Kodekernel uses the collected data for various purposes:</p>
          <ul className="list-disc list-inside text-sm space-y-2 ml-4 text-muted-foreground">
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">4. Data Transfer & Storage</h2>
          <p className="text-sm mb-4 leading-relaxed">
            Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
          </p>
          <p className="text-sm mb-2 leading-relaxed">
            We utilize Amazon Web Services (AWS) for secure data storage and processing. By submitting your information, you agree to this transfer, storing, or processing. Kodekernel will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">5. Disclosure of Data</h2>
          <p className="text-sm mb-4">Kodekernel may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
          <ul className="list-disc list-inside text-sm space-y-2 ml-4 text-muted-foreground">
            <li>To comply with a legal obligation</li>
            <li>To protect and defend the rights or property of Kodekernel</li>
            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>To protect the personal safety of users of the Service or the public</li>
            <li>To protect against legal liability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">6. Security of Data</h2>
          <p className="text-sm mb-4 leading-relaxed">
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, including SSL encryption and secure database architecture, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">7. Your Data Rights</h2>
          <p className="text-sm mb-4 leading-relaxed">
            Depending on your location, you may have rights under data privacy laws such as the GDPR or CCPA. These rights often include:
          </p>
          <ul className="list-disc list-inside text-sm space-y-2 ml-4 text-muted-foreground">
            <li>The right to access, update or to delete the information we have on you.</li>
            <li>The right of rectification.</li>
            <li>The right to object.</li>
            <li>The right of restriction.</li>
            <li>The right to data portability.</li>
            <li>The right to withdraw consent.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">8. Children's Privacy</h2>
          <p className="text-sm mb-4 leading-relaxed">
            Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">9. Third-Party Service Providers</h2>
          <p className="text-sm mb-4 leading-relaxed">
            We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">10. Contact Us</h2>
          <p className="text-sm mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-none text-sm space-y-2 ml-4 font-medium">
            <li>By email: <span className="text-primary">contact@kodekernel.com</span></li>
            <li>By visiting this page on our website: <span className="text-primary">/contact</span></li>
          </ul>
        </section>      </main>
      <Footer />
    </div>
  );
}
