'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { tasks, activityLogs, ActivityType } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { getUserWithTeam } from '@/lib/db/queries';
import { checkTaskLimit } from '@/lib/payments/limits';
import { revalidatePath } from 'next/cache';

const createTaskSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  title: z.string().min(1, 'Task title is required').max(300),
  description: z.string().max(5000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['todo', 'in_progress', 'in_review', 'completed']).default('todo'),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

export const createTask = validatedActionWithUser(
  createTaskSchema,
  async (data, formData, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    if (!userWithTeam?.teamId) {
      return { error: 'Team not found' };
    }

    const limitError = await checkTaskLimit(userWithTeam.teamId);
    if (limitError) return { error: limitError };

    await db.insert(tasks).values({
      projectId: parseInt(data.projectId),
      teamId: userWithTeam.teamId,
      title: data.title,
      description: data.description || null,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assigneeId: data.assigneeId ? parseInt(data.assigneeId) : null,
      completedAt: data.status === 'completed' ? new Date() : null,
      createdBy: user.id,
    });

    await db.insert(activityLogs).values({
      teamId: userWithTeam.teamId,
      userId: user.id,
      action: ActivityType.CREATE_TASK,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/tasks');
    revalidatePath(`/dashboard/projects/${data.projectId}`);

    return { success: 'Task created successfully' };
  }
);

const updateTaskSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(['todo', 'in_progress', 'in_review', 'completed']),
});

export const updateTaskStatus = validatedActionWithUser(
  updateTaskSchema,
  async (data, formData, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    if (!userWithTeam?.teamId) {
      return { error: 'Team not found' };
    }

    await db
      .update(tasks)
      .set({
        status: data.status,
        completedAt: data.status === 'completed' ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(tasks.id, parseInt(data.taskId)), eq(tasks.teamId, userWithTeam.teamId))
      );

    await db.insert(activityLogs).values({
      teamId: userWithTeam.teamId,
      userId: user.id,
      action: data.status === 'completed' ? ActivityType.COMPLETE_TASK : ActivityType.UPDATE_TASK,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/tasks');

    return { success: 'Task updated' };
  }
);

const deleteTaskSchema = z.object({
  taskId: z.string().min(1),
});

export const deleteTask = validatedActionWithUser(
  deleteTaskSchema,
  async (data, formData, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    if (!userWithTeam?.teamId) {
      return { error: 'Team not found' };
    }

    await db
      .delete(tasks)
      .where(
        and(eq(tasks.id, parseInt(data.taskId)), eq(tasks.teamId, userWithTeam.teamId))
      );

    await db.insert(activityLogs).values({
      teamId: userWithTeam.teamId,
      userId: user.id,
      action: ActivityType.DELETE_TASK,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/tasks');

    return { success: 'Task deleted' };
  }
);
