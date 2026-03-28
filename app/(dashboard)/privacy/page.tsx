import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: March 2026</p>

      <div className="mt-10 prose prose-gray prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect information you provide directly: your name, email address, and password when you create an account. We also collect data you enter into ProjectHub, including projects, tasks, contacts, and team information. We automatically collect usage data such as IP addresses, browser type, and pages visited.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use your information to provide, maintain, and improve ProjectHub; to process transactions and send related information; to send technical notices, updates, and support messages; and to respond to your comments, questions, and requests.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Data Storage & Security</h2>
          <p className="text-gray-600 leading-relaxed">
            Your data is stored securely on Supabase (PostgreSQL) infrastructure. We use encryption in transit (TLS) and at rest. Passwords are hashed using bcrypt. We retain your data for as long as your account is active or as needed to provide services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Data Sharing</h2>
          <p className="text-gray-600 leading-relaxed">
            We do not sell your personal information. We share data only with service providers necessary to operate ProjectHub (e.g., Supabase for database hosting, Stripe for payment processing). These providers are bound by contractual obligations to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed">
            You can access, update, or delete your account information at any time from your Settings page. You may request a complete export of your data or request account deletion by contacting us. We will respond to requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            We use a single httpOnly session cookie for authentication. We do not use tracking cookies or third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this policy from time to time. We will notify you of significant changes by posting a notice on our website or sending you an email.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Contact</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at privacy@projecthub.io.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          &larr; Back to home
        </Link>
      </div>
    </main>
  );
}
