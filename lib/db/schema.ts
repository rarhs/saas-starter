import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
  trialEndsAt: timestamp('trial_ends_at'),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

// --- Project Management Tables ---

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 30 }).notNull().default('active'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  title: varchar('title', { length: 300 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 30 }).notNull().default('todo'),
  priority: varchar('priority', { length: 20 }).notNull().default('medium'),
  assigneeId: integer('assignee_id').references(() => users.id),
  createdBy: integer('created_by').references(() => users.id),
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 200 }),
  jobTitle: varchar('job_title', { length: 150 }),
  notes: text('notes'),
  status: varchar('status', { length: 30 }).notNull().default('active'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id')
    .notNull()
    .references(() => tasks.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const labels = pgTable('labels', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  name: varchar('name', { length: 50 }).notNull(),
  color: varchar('color', { length: 20 }).notNull().default('#6b7280'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const taskLabels = pgTable('task_labels', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id')
    .notNull()
    .references(() => tasks.id),
  labelId: integer('label_id')
    .notNull()
    .references(() => labels.id),
});

export const contactProjects = pgTable('contact_projects', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id')
    .notNull()
    .references(() => contacts.id),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
});

// --- Relations ---

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
  projects: many(projects),
  tasks: many(tasks),
  contacts: many(contacts),
  labels: many(labels),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  assignedTasks: many(tasks, { relationName: 'assignee' }),
  createdTasks: many(tasks, { relationName: 'taskCreator' }),
  comments: many(comments),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  team: one(teams, { fields: [projects.teamId], references: [teams.id] }),
  creator: one(users, { fields: [projects.createdBy], references: [users.id] }),
  tasks: many(tasks),
  contactProjects: many(contactProjects),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  team: one(teams, { fields: [tasks.teamId], references: [teams.id] }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
    relationName: 'assignee',
  }),
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
    relationName: 'taskCreator',
  }),
  comments: many(comments),
  taskLabels: many(taskLabels),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  team: one(teams, { fields: [contacts.teamId], references: [teams.id] }),
  creator: one(users, { fields: [contacts.createdBy], references: [users.id] }),
  contactProjects: many(contactProjects),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, { fields: [comments.taskId], references: [tasks.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));

export const labelsRelations = relations(labels, ({ one, many }) => ({
  team: one(teams, { fields: [labels.teamId], references: [teams.id] }),
  taskLabels: many(taskLabels),
}));

export const taskLabelsRelations = relations(taskLabels, ({ one }) => ({
  task: one(tasks, { fields: [taskLabels.taskId], references: [tasks.id] }),
  label: one(labels, { fields: [taskLabels.labelId], references: [labels.id] }),
}));

export const contactProjectsRelations = relations(contactProjects, ({ one }) => ({
  contact: one(contacts, { fields: [contactProjects.contactId], references: [contacts.id] }),
  project: one(projects, { fields: [contactProjects.projectId], references: [projects.id] }),
}));

// --- Type Exports ---

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Label = typeof labels.$inferSelect;
export type NewLabel = typeof labels.$inferInsert;

export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
  CREATE_PROJECT = 'CREATE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  COMPLETE_TASK = 'COMPLETE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  CREATE_CONTACT = 'CREATE_CONTACT',
  UPDATE_CONTACT = 'UPDATE_CONTACT',
  DELETE_CONTACT = 'DELETE_CONTACT',
  ADD_COMMENT = 'ADD_COMMENT',
  EXPORT_REPORT = 'EXPORT_REPORT',
}
