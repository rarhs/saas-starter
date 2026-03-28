'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { projects, tasks, activityLogs, ActivityType } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { getUserWithTeam } from '@/lib/db/queries';
import { checkProjectLimit } from '@/lib/payments/limits';
import { revalidatePath } from 'next/cache';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200),
  description: z.string().max(5000).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createProject = validatedActionWithUser(
  createProjectSchema,
  async (data, formData, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    if (!userWithTeam?.teamId) {
      return { error: 'Team not found' };
    }

    const limitError = await checkProjectLimit(userWithTeam.teamId);
    if (limitError) return { error: limitError };

    await db.insert(projects).values({
      teamId: userWithTeam.teamId,
      name: data.name,
      description: data.description || null,
      status: 'active',
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      createdBy: user.id,
    });

    await db.insert(activityLogs).values({
      teamId: userWithTeam.teamId,
      userId: user.id,
      action: ActivityType.CREATE_PROJECT,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');

    return { success: 'Project created successfully' };
  }
);

const updateProjectSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(['active', 'on_hold', 'completed', 'archived']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updateProject = validatedActionWithUser(
  updateProjectSchema,
  async (data, formData, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    if (!userWithTeam?.teamId) {
      return { error: 'Team not found' };
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (data.name) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description || null;
    if (data.status) updates.status = data.status;
    if (data.startDate !== undefined) updates.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updates.endDate = data.endDate ? new Date(data.endDate) : null;

    await db
      .update(projects)
      .set(updates)
      .where(
        and(eq(projects.id, parseInt(data.projectId)), eq(projects.teamId, userWithTeam.teamId))
      );

    await db.insert(activityLogs).values({
      teamId: userWithTeam.teamId,
      userId: user.id,
      action: ActivityType.UPDATE_PROJECT,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');
    revalidatePath(`/dashboard/projects/${data.projectId}`);

    return { success: 'Project updated' };
  }
);

const deleteProjectSchema = z.object({
  projectId: z.string().min(1),
});

export const deleteProject = validatedActionWithUser(
  deleteProjectSchema,
  async (data, formData, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    if (!userWithTeam?.teamId) {
      return { error: 'Team not found' };
    }

    const projectId = parseInt(data.projectId);

    // Delete tasks first (cascade)
    await db.delete(tasks).where(
      and(eq(tasks.projectId, projectId), eq(tasks.teamId, userWithTeam.teamId))
    );

    await db.delete(projects).where(
      and(eq(projects.id, projectId), eq(projects.teamId, userWithTeam.teamId))
    );

    await db.insert(activityLogs).values({
      teamId: userWithTeam.teamId,
      userId: user.id,
      action: ActivityType.DELETE_PROJECT,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');
    revalidatePath('/dashboard/tasks');

    return { success: 'Project deleted' };
  }
);
