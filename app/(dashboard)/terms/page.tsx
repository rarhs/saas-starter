import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: March 2026</p>

      <div className="mt-10 prose prose-gray prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using ProjectHub, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the service. We may update these terms from time to time and will notify you of material changes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Account Registration</h2>
          <p className="text-gray-600 leading-relaxed">
            You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activity under your account. You must be at least 18 years old to use ProjectHub.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Free Trial & Subscription</h2>
          <p className="text-gray-600 leading-relaxed">
            New accounts receive a 14-day free trial with full access to Pro features. After the trial ends, your account reverts to the Free plan with usage limits (3 projects, 20 tasks, 10 contacts). You may upgrade to the Pro plan at any time. Subscriptions are billed monthly and can be cancelled at any time. No refunds are provided for partial billing periods.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Acceptable Use</h2>
          <p className="text-gray-600 leading-relaxed">
            You agree not to use ProjectHub to violate any laws, infringe intellectual property rights, transmit malicious code, attempt to gain unauthorized access, or interfere with the service. We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Your Data</h2>
          <p className="text-gray-600 leading-relaxed">
            You retain ownership of all data you enter into ProjectHub. We do not claim any intellectual property rights over your content. You grant us a limited license to store, process, and display your data solely to provide the service. You may export or delete your data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Service Availability</h2>
          <p className="text-gray-600 leading-relaxed">
            We strive for high availability but do not guarantee uninterrupted service. We may perform maintenance, updates, or modifications that temporarily affect availability. We will provide reasonable notice for planned downtime when possible.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            ProjectHub is provided &quot;as is&quot; without warranties of any kind. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Termination</h2>
          <p className="text-gray-600 leading-relaxed">
            You may close your account at any time from your Settings page. We may terminate or suspend your account for violation of these terms. Upon termination, your right to use the service ceases immediately. We will retain your data for 30 days after account closure, after which it will be permanently deleted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">9. Governing Law</h2>
          <p className="text-gray-600 leading-relaxed">
            These terms are governed by applicable law. Any disputes shall be resolved through binding arbitration.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">10. Contact</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about these Terms of Service, please contact us at legal@projecthub.io.
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
