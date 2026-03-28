import type { Project, Task, Contact, Comment, Label } from './schema';

// --- Mock Users (matches existing user shape) ---
export const mockUsers = [
  { id: 1, name: 'Sagar Rahman', email: 'sagar@projecthub.io' },
  { id: 2, name: 'Ayesha Khan', email: 'ayesha@projecthub.io' },
  { id: 3, name: 'David Chen', email: 'david@projecthub.io' },
  { id: 4, name: 'Maria Santos', email: 'maria@projecthub.io' },
];

// --- Mock Labels ---
export const mockLabels: Label[] = [
  { id: 1, teamId: 1, name: 'Bug', color: '#ef4444', createdAt: new Date('2026-01-15') },
  { id: 2, teamId: 1, name: 'Feature', color: '#3b82f6', createdAt: new Date('2026-01-15') },
  { id: 3, teamId: 1, name: 'Urgent', color: '#f97316', createdAt: new Date('2026-01-15') },
  { id: 4, teamId: 1, name: 'Design', color: '#8b5cf6', createdAt: new Date('2026-01-15') },
];

// --- Mock Projects ---
export const mockProjects: Project[] = [
  {
    id: 1,
    teamId: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved UX.',
    status: 'active',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-05-15'),
    createdBy: 1,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-03-20'),
  },
  {
    id: 2,
    teamId: 1,
    name: 'Mobile App v2',
    description: 'Second major version of the mobile application with offline support and push notifications.',
    status: 'active',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-07-30'),
    createdBy: 1,
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-03-22'),
  },
  {
    id: 3,
    teamId: 1,
    name: 'API Integration Hub',
    description: 'Build a centralized integration platform for third-party API connections.',
    status: 'on_hold',
    startDate: new Date('2026-01-10'),
    endDate: new Date('2026-04-30'),
    createdBy: 2,
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    id: 4,
    teamId: 1,
    name: 'Q1 Marketing Campaign',
    description: 'Plan and execute digital marketing campaigns for Q1 2026.',
    status: 'completed',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-03-31'),
    createdBy: 3,
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2026-03-25'),
  },
];

// --- Mock Tasks ---
export const mockTasks: Task[] = [
  // Website Redesign tasks
  {
    id: 1, projectId: 1, teamId: 1,
    title: 'Design new homepage layout',
    description: 'Create wireframes and high-fidelity mockups for the new homepage.',
    status: 'completed', priority: 'high',
    assigneeId: 2, createdBy: 1,
    dueDate: new Date('2026-03-01'),
    completedAt: new Date('2026-02-28'),
    position: 0,
    createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-28'),
  },
  {
    id: 2, projectId: 1, teamId: 1,
    title: 'Implement responsive navigation',
    description: 'Build the new responsive navigation component with mobile hamburger menu.',
    status: 'in_progress', priority: 'high',
    assigneeId: 3, createdBy: 1,
    dueDate: new Date('2026-03-28'),
    completedAt: null,
    position: 1,
    createdAt: new Date('2026-02-15'), updatedAt: new Date('2026-03-20'),
  },
  {
    id: 3, projectId: 1, teamId: 1,
    title: 'Set up analytics tracking',
    description: 'Integrate Google Analytics 4 and custom event tracking.',
    status: 'todo', priority: 'medium',
    assigneeId: 1, createdBy: 1,
    dueDate: new Date('2026-04-10'),
    completedAt: null,
    position: 2,
    createdAt: new Date('2026-02-20'), updatedAt: new Date('2026-02-20'),
  },
  {
    id: 4, projectId: 1, teamId: 1,
    title: 'Optimize images and assets',
    description: 'Compress and convert images to WebP format for faster loading.',
    status: 'todo', priority: 'low',
    assigneeId: null, createdBy: 2,
    dueDate: new Date('2026-04-15'),
    completedAt: null,
    position: 3,
    createdAt: new Date('2026-03-01'), updatedAt: new Date('2026-03-01'),
  },
  // Mobile App v2 tasks
  {
    id: 5, projectId: 2, teamId: 1,
    title: 'Set up offline data sync',
    description: 'Implement local storage with background sync when connection is restored.',
    status: 'in_progress', priority: 'high',
    assigneeId: 3, createdBy: 1,
    dueDate: new Date('2026-04-15'),
    completedAt: null,
    position: 0,
    createdAt: new Date('2026-03-05'), updatedAt: new Date('2026-03-22'),
  },
  {
    id: 6, projectId: 2, teamId: 1,
    title: 'Push notification service',
    description: 'Integrate Firebase Cloud Messaging for push notifications.',
    status: 'todo', priority: 'medium',
    assigneeId: 4, createdBy: 1,
    dueDate: new Date('2026-05-01'),
    completedAt: null,
    position: 1,
    createdAt: new Date('2026-03-05'), updatedAt: new Date('2026-03-05'),
  },
  {
    id: 7, projectId: 2, teamId: 1,
    title: 'Design app onboarding flow',
    description: 'Create onboarding screens for new users with tutorial highlights.',
    status: 'in_review', priority: 'medium',
    assigneeId: 2, createdBy: 1,
    dueDate: new Date('2026-03-30'),
    completedAt: null,
    position: 2,
    createdAt: new Date('2026-03-10'), updatedAt: new Date('2026-03-24'),
  },
  {
    id: 8, projectId: 2, teamId: 1,
    title: 'Performance benchmarking',
    description: 'Run performance tests and establish baseline metrics.',
    status: 'todo', priority: 'low',
    assigneeId: null, createdBy: 3,
    dueDate: new Date('2026-05-15'),
    completedAt: null,
    position: 3,
    createdAt: new Date('2026-03-15'), updatedAt: new Date('2026-03-15'),
  },
  // API Integration Hub tasks
  {
    id: 9, projectId: 3, teamId: 1,
    title: 'Define API gateway architecture',
    description: 'Document the architecture for the centralized API gateway.',
    status: 'completed', priority: 'high',
    assigneeId: 1, createdBy: 2,
    dueDate: new Date('2026-02-01'),
    completedAt: new Date('2026-01-28'),
    position: 0,
    createdAt: new Date('2026-01-10'), updatedAt: new Date('2026-01-28'),
  },
  {
    id: 10, projectId: 3, teamId: 1,
    title: 'Build OAuth2 connector',
    description: 'Create reusable OAuth2 authentication connector for third-party APIs.',
    status: 'in_progress', priority: 'high',
    assigneeId: 3, createdBy: 2,
    dueDate: new Date('2026-03-15'),
    completedAt: null,
    position: 1,
    createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-03-10'),
  },
  {
    id: 11, projectId: 3, teamId: 1,
    title: 'Rate limiting middleware',
    description: 'Implement rate limiting to protect against API abuse.',
    status: 'todo', priority: 'medium',
    assigneeId: null, createdBy: 2,
    dueDate: new Date('2026-04-01'),
    completedAt: null,
    position: 2,
    createdAt: new Date('2026-02-10'), updatedAt: new Date('2026-02-10'),
  },
  // Q1 Marketing tasks
  {
    id: 12, projectId: 4, teamId: 1,
    title: 'Create social media content calendar',
    description: 'Plan 3 months of social media posts across all platforms.',
    status: 'completed', priority: 'high',
    assigneeId: 4, createdBy: 3,
    dueDate: new Date('2026-01-15'),
    completedAt: new Date('2026-01-14'),
    position: 0,
    createdAt: new Date('2025-12-20'), updatedAt: new Date('2026-01-14'),
  },
  {
    id: 13, projectId: 4, teamId: 1,
    title: 'Launch email drip campaign',
    description: 'Set up automated email sequences for lead nurturing.',
    status: 'completed', priority: 'high',
    assigneeId: 4, createdBy: 3,
    dueDate: new Date('2026-02-01'),
    completedAt: new Date('2026-01-30'),
    position: 1,
    createdAt: new Date('2026-01-05'), updatedAt: new Date('2026-01-30'),
  },
  {
    id: 14, projectId: 4, teamId: 1,
    title: 'Analyze campaign ROI',
    description: 'Compile and analyze ROI metrics for all Q1 campaigns.',
    status: 'completed', priority: 'medium',
    assigneeId: 3, createdBy: 3,
    dueDate: new Date('2026-03-25'),
    completedAt: new Date('2026-03-24'),
    position: 2,
    createdAt: new Date('2026-03-10'), updatedAt: new Date('2026-03-24'),
  },
];

// --- Mock Contacts ---
export const mockContacts: Contact[] = [
  {
    id: 1, teamId: 1,
    name: 'James Wilson',
    email: 'james.wilson@acmecorp.com',
    phone: '+1-555-0101',
    company: 'Acme Corporation',
    jobTitle: 'VP of Engineering',
    notes: 'Key decision maker for the enterprise deal. Prefers email communication.',
    status: 'client',
    createdBy: 1,
    createdAt: new Date('2026-01-10'), updatedAt: new Date('2026-03-15'),
  },
  {
    id: 2, teamId: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@globex.io',
    phone: '+1-555-0202',
    company: 'Globex Industries',
    jobTitle: 'Product Manager',
    notes: 'Interested in our API integration capabilities. Meeting scheduled for next week.',
    status: 'lead',
    createdBy: 1,
    createdAt: new Date('2026-02-05'), updatedAt: new Date('2026-03-20'),
  },
  {
    id: 3, teamId: 1,
    name: 'Michael Brown',
    email: 'mbrown@techstart.co',
    phone: '+44-20-7123-4567',
    company: 'TechStart',
    jobTitle: 'CTO',
    notes: 'Referred by James Wilson. Looking for a project management solution for 50+ team.',
    status: 'lead',
    createdBy: 2,
    createdAt: new Date('2026-02-20'), updatedAt: new Date('2026-03-18'),
  },
  {
    id: 4, teamId: 1,
    name: 'Emma Davis',
    email: 'emma.davis@designco.com',
    phone: '+1-555-0404',
    company: 'DesignCo',
    jobTitle: 'Creative Director',
    notes: 'Freelance design partner for our website redesign project.',
    status: 'active',
    createdBy: 2,
    createdAt: new Date('2026-01-25'), updatedAt: new Date('2026-02-10'),
  },
  {
    id: 5, teamId: 1,
    name: 'Robert Kim',
    email: 'robert.kim@nexusventures.com',
    phone: '+1-555-0505',
    company: 'Nexus Ventures',
    jobTitle: 'Managing Partner',
    notes: 'Potential investor. Met at TechCrunch Disrupt.',
    status: 'active',
    createdBy: 1,
    createdAt: new Date('2026-03-01'), updatedAt: new Date('2026-03-22'),
  },
  {
    id: 6, teamId: 1,
    name: 'Lisa Chen',
    email: 'lisa@cloudserve.io',
    phone: '+65-6789-0123',
    company: 'CloudServe',
    jobTitle: 'Head of Partnerships',
    notes: 'Partnership discussion for co-marketing. Singapore timezone.',
    status: 'lead',
    createdBy: 3,
    createdAt: new Date('2026-03-10'), updatedAt: new Date('2026-03-24'),
  },
  {
    id: 7, teamId: 1,
    name: 'Ahmed Hassan',
    email: 'ahmed@oldclient.com',
    phone: '+971-50-123-4567',
    company: 'Old Client LLC',
    jobTitle: 'IT Director',
    notes: 'Previous client. Contract ended Dec 2025.',
    status: 'inactive',
    createdBy: 1,
    createdAt: new Date('2025-06-15'), updatedAt: new Date('2025-12-31'),
  },
];

// --- Mock Comments ---
export const mockComments: Comment[] = [
  {
    id: 1, taskId: 2, userId: 3,
    content: 'Started working on the mobile breakpoints. Should have the first draft ready by EOD.',
    createdAt: new Date('2026-03-20T10:30:00'), updatedAt: new Date('2026-03-20T10:30:00'),
  },
  {
    id: 2, taskId: 2, userId: 1,
    content: 'Looks great so far! Make sure to test on iPad Pro as well.',
    createdAt: new Date('2026-03-20T14:15:00'), updatedAt: new Date('2026-03-20T14:15:00'),
  },
  {
    id: 3, taskId: 5, userId: 3,
    content: 'Using IndexedDB for local storage. Need to handle conflict resolution for concurrent edits.',
    createdAt: new Date('2026-03-22T09:00:00'), updatedAt: new Date('2026-03-22T09:00:00'),
  },
  {
    id: 4, taskId: 7, userId: 2,
    content: 'Uploaded the onboarding mockups to Figma. Please review when you get a chance.',
    createdAt: new Date('2026-03-24T11:00:00'), updatedAt: new Date('2026-03-24T11:00:00'),
  },
];

// --- Mock Contact-Project Links ---
export const mockContactProjects = [
  { id: 1, contactId: 1, projectId: 2 }, // James Wilson → Mobile App v2
  { id: 2, contactId: 4, projectId: 1 }, // Emma Davis → Website Redesign
  { id: 3, contactId: 2, projectId: 3 }, // Sarah Johnson → API Integration Hub
];

// --- Helper functions ---

export function getProjectById(id: number): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getTasksByProjectId(projectId: number): Task[] {
  return mockTasks.filter((t) => t.projectId === projectId);
}

export function getTaskById(id: number): Task | undefined {
  return mockTasks.find((t) => t.id === id);
}

export function getContactById(id: number): Contact | undefined {
  return mockContacts.find((c) => c.id === id);
}

export function getCommentsByTaskId(taskId: number): Comment[] {
  return mockComments.filter((c) => c.taskId === taskId);
}

export function getUserById(id: number) {
  return mockUsers.find((u) => u.id === id);
}

export function getProjectsForContact(contactId: number): Project[] {
  const projectIds = mockContactProjects
    .filter((cp) => cp.contactId === contactId)
    .map((cp) => cp.projectId);
  return mockProjects.filter((p) => projectIds.includes(p.id));
}

export function getContactsForProject(projectId: number): Contact[] {
  const contactIds = mockContactProjects
    .filter((cp) => cp.projectId === projectId)
    .map((cp) => cp.contactId);
  return mockContacts.filter((c) => contactIds.includes(c.id));
}

// --- Dashboard metrics ---
export function getDashboardMetrics() {
  const totalProjects = mockProjects.filter((p) => p.status !== 'archived').length;
  const activeProjects = mockProjects.filter((p) => p.status === 'active').length;
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = mockTasks.filter((t) => t.status === 'in_progress').length;
  const todoTasks = mockTasks.filter((t) => t.status === 'todo').length;
  const inReviewTasks = mockTasks.filter((t) => t.status === 'in_review').length;
  const overdueTasks = mockTasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate < new Date()
  ).length;
  const totalContacts = mockContacts.filter((c) => c.status !== 'inactive').length;
  const teamMembers = mockUsers.length;

  return {
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    inReviewTasks,
    overdueTasks,
    totalContacts,
    teamMembers,
  };
}

export function getRecentTasks(limit = 5): Task[] {
  return [...mockTasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit);
}

export function getUpcomingDeadlines(days = 7): Task[] {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return mockTasks
    .filter(
      (t) =>
        t.status !== 'completed' &&
        t.dueDate &&
        t.dueDate >= now &&
        t.dueDate <= future
    )
    .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime());
}
