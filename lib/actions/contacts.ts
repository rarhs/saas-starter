'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { contacts, activityLogs, ActivityType } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { getUserWithTeam } from '@/lib/db/queries';
import { checkContactLimit } from '@/lib/payments/limits';
import { revalidatePath } from 'next/cache';

const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  company: z.string().max(200).optional(),
  jobTitle: z.string().max(150).optional(),
  notes: z.string().max(5000).optional(),
  status: z.enum(['active', 'inactive', 'lead', 'client']).default('active'),
});

export const createContact = validatedActionWithUser(
  createContactSchema,
  async (data, formData, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    if (!userWithTeam?.teamId) {
      return { error: 'Team not found' };
    }

    const limitError = await checkContactLimit(userWithTeam.teamId);
    if (limitError) return { error: limitError };

    await db.insert(contacts).values({
      teamId: userWithTeam.teamId,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      jobTitle: data.jobTitle || null,
      notes: data.notes || null,
      status: data.status,
      createdBy: user.id,
    });

    await db.insert(activityLogs).values({
      teamId: userWithTeam.teamId,
      userId: user.id,
      action: ActivityType.CREATE_CONTACT,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/contacts');

    return { success: 'Contact created successfully' };
  }
);

const deleteContactSchema = z.object({
  contactId: z.string().min(1),
});

export const deleteContact = validatedActionWithUser(
  deleteContactSchema,
  async (data, formData, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    if (!userWithTeam?.teamId) {
      return { error: 'Team not found' };
    }

    await db
      .delete(contacts)
      .where(
        and(eq(contacts.id, parseInt(data.contactId)), eq(contacts.teamId, userWithTeam.teamId))
      );

    await db.insert(activityLogs).values({
      teamId: userWithTeam.teamId,
      userId: user.id,
      action: ActivityType.DELETE_CONTACT,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/contacts');

    return { success: 'Contact deleted' };
  }
);

const updateContactSchema = z.object({
  contactId: z.string().min(1),
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  company: z.string().max(200).optional(),
  jobTitle: z.string().max(150).optional(),
  notes: z.string().max(5000).optional(),
  status: z.enum(['active', 'inactive', 'lead', 'client']),
});

export const updateContact = validatedActionWithUser(
  updateContactSchema,
  async (data, formData, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    if (!userWithTeam?.teamId) {
      return { error: 'Team not found' };
    }

    await db
      .update(contacts)
      .set({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        jobTitle: data.jobTitle || null,
        notes: data.notes || null,
        status: data.status,
        updatedAt: new Date(),
      })
      .where(
        and(eq(contacts.id, parseInt(data.contactId)), eq(contacts.teamId, userWithTeam.teamId))
      );

    await db.insert(activityLogs).values({
      teamId: userWithTeam.teamId,
      userId: user.id,
      action: ActivityType.UPDATE_CONTACT,
    });

    revalidatePath('/dashboard/contacts');
    revalidatePath(`/dashboard/contacts/${data.contactId}`);

    return { success: 'Contact updated' };
  }
);
