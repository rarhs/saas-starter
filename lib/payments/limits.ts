import { db } from '@/lib/db/drizzle';
import { projects, tasks, contacts, teams } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

const FREE_LIMITS = {
  maxProjects: 3,
  maxTasks: 20,
  maxContacts: 10,
  canExport: false,
};

const PRO_LIMITS = {
  maxProjects: Infinity,
  maxTasks: Infinity,
  maxContacts: Infinity,
  canExport: true,
};

export function isProPlan(team: { subscriptionStatus: string | null }) {
  return team.subscriptionStatus === 'active' || team.subscriptionStatus === 'trialing';
}

export function isTrialActive(team: { trialEndsAt: Date | null; subscriptionStatus: string | null }) {
  if (isProPlan(team)) return true;
  if (team.trialEndsAt && new Date(team.trialEndsAt) > new Date()) return true;
  return false;
}

export function getFeatureLimits(team: { trialEndsAt: Date | null; subscriptionStatus: string | null }) {
  if (isTrialActive(team)) return PRO_LIMITS;
  return FREE_LIMITS;
}

export async function checkProjectLimit(teamId: number): Promise<string | null> {
  const team = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);
  if (!team[0]) return 'Team not found';

  const limits = getFeatureLimits(team[0]);
  if (limits.maxProjects === Infinity) return null;

  const [result] = await db.select({ count: count() }).from(projects).where(eq(projects.teamId, teamId));
  if ((result?.count || 0) >= limits.maxProjects) {
    return `Free plan allows up to ${limits.maxProjects} projects. Upgrade to Pro for unlimited projects.`;
  }
  return null;
}

export async function checkTaskLimit(teamId: number): Promise<string | null> {
  const team = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);
  if (!team[0]) return 'Team not found';

  const limits = getFeatureLimits(team[0]);
  if (limits.maxTasks === Infinity) return null;

  const [result] = await db.select({ count: count() }).from(tasks).where(eq(tasks.teamId, teamId));
  if ((result?.count || 0) >= limits.maxTasks) {
    return `Free plan allows up to ${limits.maxTasks} tasks. Upgrade to Pro for unlimited tasks.`;
  }
  return null;
}

export async function checkContactLimit(teamId: number): Promise<string | null> {
  const team = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);
  if (!team[0]) return 'Team not found';

  const limits = getFeatureLimits(team[0]);
  if (limits.maxContacts === Infinity) return null;

  const [result] = await db.select({ count: count() }).from(contacts).where(eq(contacts.teamId, teamId));
  if ((result?.count || 0) >= limits.maxContacts) {
    return `Free plan allows up to ${limits.maxContacts} contacts. Upgrade to Pro for unlimited contacts.`;
  }
  return null;
}
