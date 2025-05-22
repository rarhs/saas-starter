import { z } from 'zod';

const visibilityEnum = z.enum(['private', 'team', 'public']);

export const createSnippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string().min(1, 'Language is required').max(100, 'Language is too long'),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  tags: z.array(z.string().max(50, 'Tag is too long')).max(10, 'Too many tags').optional().nullable(),
  teamId: z.number().int().positive().optional().nullable(),
  visibility: visibilityEnum,
});

export type CreateSnippetPayload = z.infer<typeof createSnippetSchema>;

export const updateSnippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
  code: z.string().min(1, 'Code cannot be empty').optional(),
  language: z.string().min(1, 'Language is required').max(100, 'Language is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  tags: z.array(z.string().max(50, 'Tag is too long')).max(10, 'Too many tags').optional().nullable(),
  // teamId should not be directly updatable here; handled by visibility change or specific team assignment logic
  visibility: visibilityEnum.optional(),
});

export type UpdateSnippetPayload = z.infer<typeof updateSnippetSchema>;
