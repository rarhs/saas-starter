import { checkoutAction } from '@/lib/payments/actions';
import { Check, X, ChevronDown } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const revalidate = 3600;

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. You can cancel your subscription at any time from your Settings page. You\'ll keep access until the end of your billing period.',
  },
  {
    q: 'What happens after the trial ends?',
    a: 'After 14 days, your account moves to the Free plan with limits of 3 projects, 20 tasks, and 10 contacts. Upgrade to Pro anytime to unlock unlimited usage.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'No. There are no setup fees, hidden charges, or long-term contracts. You only pay the monthly subscription price.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes. You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.',
  },
];

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const proPlan =
    products.find((product) => product.name === 'Pro') ||
    products.find((product) => product.name === 'Plus') ||
    products.find((product) => product.name === 'Base');

  const proPrice = prices.find((price) => price.productId === proPlan?.id);

  return (
    <main className="min-h-[calc(100dvh-68px)]">
      {/* Header */}
      <section className="pt-16 pb-4 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Simple, honest pricing
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Start free, upgrade when you&#39;re ready. No surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="rounded-2xl border border-gray-200 p-8 flex flex-col">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Free</h2>
                <p className="mt-1 text-sm text-gray-500">
                  For individuals getting started
                </p>
                <p className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-2">forever</span>
                </p>
              </div>
              <ul className="mt-8 space-y-3.5 flex-1">
                {[
                  { text: 'Up to 3 projects', ok: true },
                  { text: 'Up to 20 tasks', ok: true },
                  { text: 'Up to 10 contacts', ok: true },
                  { text: 'Team collaboration', ok: true },
                  { text: 'Reports & Export', ok: false },
                  { text: 'Priority support', ok: false },
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    {f.ok ? (
                      <Check className="h-4 w-4 text-gray-900 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-gray-300 shrink-0" />
                    )}
                    <span className={`text-sm ${f.ok ? 'text-gray-700' : 'text-gray-400'}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full h-11"
                >
                  <Link href="/sign-up">Start Free Trial</Link>
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border-2 border-gray-900 p-8 flex flex-col relative">
              <div className="absolute -top-3 left-6 bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                Most popular
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pro</h2>
                <p className="mt-1 text-sm text-gray-500">
                  For teams that need more
                </p>
                <p className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${(proPrice?.unitAmount || 1200) / 100}
                  </span>
                  <span className="text-gray-500 ml-2">
                    / user / {proPrice?.interval || 'month'}
                  </span>
                </p>
              </div>
              <ul className="mt-8 space-y-3.5 flex-1">
                {[
                  'Unlimited projects',
                  'Unlimited tasks',
                  'Unlimited contacts',
                  'Team collaboration',
                  'Reports & CSV export',
                  'Priority support',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-gray-900 shrink-0" />
                    <span className="text-sm text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <form action={checkoutAction}>
                  <input type="hidden" name="priceId" value={proPrice?.id} />
                  <SubmitButton />
                </form>
              </div>
              <p className="mt-3 text-xs text-center text-gray-400">
                14-day free trial included
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <details key={i} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-medium text-gray-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
