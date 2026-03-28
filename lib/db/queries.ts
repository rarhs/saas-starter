import { desc, and, eq, isNull, count, ne, lt, gte } from 'drizzle-orm';
import { db } from './drizzle';
import {
  activityLogs, teamMembers, teams, users,
  projects, tasks, contacts, contactProjects,
} from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}

export async function getProjectsByTeam(teamId: number) {
  return await db
    .select()
    .from(projects)
    .where(eq(projects.teamId, teamId))
    .orderBy(desc(projects.createdAt));
}

export async function getProjectById(projectId: number, teamId: number) {
  const result = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.teamId, teamId)))
    .limit(1);
  return result[0] || null;
}

export async function getTasksByTeam(teamId: number) {
  return await db
    .select({
      task: tasks,
      projectName: projects.name,
      assigneeName: users.name,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(eq(tasks.teamId, teamId))
    .orderBy(desc(tasks.createdAt));
}

export async function getTasksByProject(projectId: number, teamId: number) {
  return await db
    .select({
      task: tasks,
      assigneeName: users.name,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(and(eq(tasks.projectId, projectId), eq(tasks.teamId, teamId)))
    .orderBy(tasks.position);
}

export async function getContactsByTeam(teamId: number) {
  return await db
    .select()
    .from(contacts)
    .where(eq(contacts.teamId, teamId))
    .orderBy(desc(contacts.createdAt));
}

export async function getContactById(contactId: number, teamId: number) {
  const result = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.teamId, teamId)))
    .limit(1);
  return result[0] || null;
}

export async function getProjectsForContact(contactId: number) {
  return await db
    .select({ project: projects })
    .from(contactProjects)
    .innerJoin(projects, eq(contactProjects.projectId, projects.id))
    .where(eq(contactProjects.contactId, contactId));
}

export async function getDashboardMetrics(teamId: number) {
  const [projectRows, taskRows, contactCount, memberCount] = await Promise.all([
    db.select().from(projects).where(eq(projects.teamId, teamId)),
    db.select().from(tasks).where(eq(tasks.teamId, teamId)),
    db.select({ count: count() }).from(contacts).where(
      and(eq(contacts.teamId, teamId), ne(contacts.status, 'inactive'))
    ),
    db.select({ count: count() }).from(teamMembers).where(eq(teamMembers.teamId, teamId)),
  ]);

  const activeProjects = projectRows.filter((p) => p.status === 'active').length;
  const totalTasks = taskRows.length;
  const completedTasks = taskRows.filter((t) => t.status === 'completed').length;
  const inProgressTasks = taskRows.filter((t) => t.status === 'in_progress').length;
  const todoTasks = taskRows.filter((t) => t.status === 'todo').length;
  const inReviewTasks = taskRows.filter((t) => t.status === 'in_review').length;
  const overdueTasks = taskRows.filter(
    (t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  return {
    totalProjects: projectRows.length,
    activeProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    inReviewTasks,
    overdueTasks,
    totalContacts: contactCount[0]?.count || 0,
    teamMembers: memberCount[0]?.count || 0,
  };
}

export async function getRecentTasks(teamId: number, limit = 5) {
  return await db
    .select({
      task: tasks,
      projectName: projects.name,
      assigneeName: users.name,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(eq(tasks.teamId, teamId))
    .orderBy(desc(tasks.updatedAt))
    .limit(limit);
}

export async function getUpcomingDeadlines(teamId: number) {
  return await db
    .select({
      task: tasks,
      assigneeName: users.name,
      projectName: projects.name,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .where(
      and(
        eq(tasks.teamId, teamId),
        ne(tasks.status, 'completed')
      )
    )
    .orderBy(tasks.dueDate)
    .limit(10);
}
