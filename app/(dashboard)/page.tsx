import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckSquare,
  FolderKanban,
  Users,
  BarChart3,
  Zap,
  Shield,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { getUser } from '@/lib/db/queries';

export default async function HomePage() {
  const user = await getUser();
  const ctaHref = user ? '/dashboard' : '/sign-up';
  const ctaLabel = user ? 'Go to Dashboard' : 'Start Free Trial';
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-28 lg:pb-36">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 mb-8">
                <Zap className="h-3.5 w-3.5 text-orange-500" />
                Now with team collaboration
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                Your team&#39;s work,{' '}
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  finally visible
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 leading-relaxed">
                ProjectHub brings your projects, tasks, and contacts into one
                clear workspace. Stop juggling tools — start shipping.
              </p>
              <div className="mt-10 flex items-center gap-4 flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full text-base px-8 h-12 shadow-lg shadow-gray-900/10"
                >
                  <Link href={ctaHref}>
                    {ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!user && (
                  <Link
                    href="/pricing"
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900"
                  >
                    View pricing
                  </Link>
                )}
              </div>
              <p className="mt-4 text-sm text-gray-400">
                14-day free trial. No credit card required.
              </p>
            </div>

            {/* Product preview */}
            <div className="mt-16 lg:mt-0 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange-100/40 to-blue-100/40 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden">
                {/* Window chrome */}
                <div className="border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-gray-50 rounded-md px-12 py-1 text-[10px] text-gray-400 font-mono">
                      projecthub.io/dashboard
                    </div>
                  </div>
                </div>
                {/* Dashboard content */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Projects', value: '12', color: 'bg-orange-500', lightColor: 'bg-orange-50' },
                      { label: 'Active Tasks', value: '47', color: 'bg-blue-500', lightColor: 'bg-blue-50' },
                      { label: 'On Track', value: '94%', color: 'bg-emerald-500', lightColor: 'bg-emerald-50' },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={`${stat.lightColor} rounded-xl p-3.5 animate-[fadeInUp_0.5s_ease_forwards] opacity-0`}
                        style={{ animationDelay: `${i * 150 + 200}ms` }}
                      >
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Website Redesign', status: 'In Progress', pct: 68, color: 'bg-blue-500' },
                      { name: 'Mobile App v2', status: 'On Track', pct: 45, color: 'bg-emerald-500' },
                      { name: 'API Integration', status: 'Review', pct: 89, color: 'bg-amber-500' },
                    ].map((project, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-[fadeInUp_0.5s_ease_forwards] opacity-0"
                        style={{ animationDelay: `${i * 120 + 700}ms` }}
                      >
                        <div className={`w-1.5 h-8 rounded-full ${project.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">{project.name}</span>
                            <span className="text-[10px] text-gray-400">{project.pct}%</span>
                          </div>
                          <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${project.color} rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${project.pct}%`, animationDelay: `${i * 200 + 1000}ms` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-400 mb-8">
            Trusted by teams at companies like
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {['Acme Corp', 'Globex', 'TechStart', 'CloudServe', 'NexusIO'].map(
              (name) => (
                <span
                  key={name}
                  className="text-lg font-semibold text-gray-300 tracking-tight"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features — Alternating Layout */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Everything you need to deliver
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              A focused set of tools designed for teams who value clarity over
              complexity.
            </p>
          </div>

          <div className="space-y-24 lg:space-y-32">
            {/* Feature 1 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 mb-5">
                  <FolderKanban className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Project Tracking
                </h3>
                <p className="mt-3 text-gray-500 leading-relaxed">
                  Organize work into projects with timelines, progress tracking,
                  and team assignments. See every project&#39;s health at a glance.
                </p>
                <ul className="mt-6 space-y-3">
                  {['Visual progress bars', 'Start & end dates', 'Status workflows'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 lg:mt-0">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="space-y-3">
                    {['Website Redesign', 'Mobile App v2', 'Q1 Campaign'].map(
                      (name, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-400' : i === 1 ? 'bg-blue-400' : 'bg-gray-300'}`} />
                            <span className="text-sm font-medium text-gray-800">{name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${i === 0 ? 'bg-emerald-400 w-3/4' : i === 1 ? 'bg-blue-400 w-1/2' : 'bg-gray-300 w-full'}`} />
                            </div>
                            <span className="text-[11px] text-gray-400 w-8">{i === 0 ? '75%' : i === 1 ? '50%' : '100%'}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 — Reversed */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 mb-5">
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Task Management
                </h3>
                <p className="mt-3 text-gray-500 leading-relaxed">
                  Create, assign, and track tasks with priorities, due dates,
                  and status workflows. Never lose track of what needs to happen next.
                </p>
                <ul className="mt-6 space-y-3">
                  {['Priority levels', 'Assignee tracking', 'Due date alerts'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 lg:mt-0 order-1">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="space-y-2">
                    {[
                      { title: 'Design homepage', status: 'Done', statusColor: 'bg-emerald-100 text-emerald-700', priority: 'High' },
                      { title: 'Set up CI/CD', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700', priority: 'Urgent' },
                      { title: 'Write API docs', status: 'To Do', statusColor: 'bg-gray-100 text-gray-600', priority: 'Medium' },
                      { title: 'User testing', status: 'Review', statusColor: 'bg-amber-100 text-amber-700', priority: 'High' },
                    ].map((task, i) => (
                      <div key={i} className="bg-white rounded-lg px-4 py-3 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${task.status === 'Done' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                            {task.status === 'Done' && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm ${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</span>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${task.statusColor}`}>{task.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100 mb-5">
                  <Users className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Contact Management
                </h3>
                <p className="mt-3 text-gray-500 leading-relaxed">
                  Keep track of clients, partners, and leads with notes and
                  project linking. Build stronger relationships with full context.
                </p>
                <ul className="mt-6 space-y-3">
                  {['Company & role tracking', 'Notes & history', 'Project linking'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 lg:mt-0">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Johnson', role: 'Product Manager', company: 'Globex', type: 'Lead' },
                      { name: 'James Wilson', role: 'VP Engineering', company: 'Acme Corp', type: 'Client' },
                      { name: 'Lisa Chen', role: 'Head of Partnerships', company: 'CloudServe', type: 'Lead' },
                    ].map((contact, i) => (
                      <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{contact.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">{contact.role} at {contact.company}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${contact.type === 'Client' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {contact.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 — Reversed */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 mb-5">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Reports & Export
                </h3>
                <p className="mt-3 text-gray-500 leading-relaxed">
                  Generate reports and export data to CSV. Get insights into
                  team performance and project health at a glance.
                </p>
                <ul className="mt-6 space-y-3">
                  {['CSV export', 'Task summaries', 'Project overviews'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 lg:mt-0 order-1">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-end gap-2 h-32">
                      {[35, 52, 41, 68, 75, 59, 82].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end">
                          <div
                            className="bg-gray-900 rounded-t-sm transition-all"
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 px-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Teams' },
              { value: '50k+', label: 'Tasks completed' },
              { value: '99.9%', label: 'Uptime' },
              { value: '<2min', label: 'Setup time' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl lg:text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-gray-900" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to see your team&#39;s work clearly?
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Join hundreds of teams using ProjectHub to ship faster.
            Start your 14-day free trial — no credit card needed.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-gray-100 text-gray-900 rounded-full text-base px-8 h-12 font-medium"
            >
              <Link href={ctaHref}>
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 14-day trial</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Setup in 2 min</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="font-semibold text-gray-900">ProjectHub</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Project management for teams that ship.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Account</h4>
              <ul className="space-y-2">
                <li><Link href="/sign-in" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign In</Link></li>
                <li><Link href="/sign-up" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-gray-400">Privacy Policy</span></li>
                <li><span className="text-sm text-gray-400">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} ProjectHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
