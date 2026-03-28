import { redirect } from 'next/navigation';
import {
  getUser,
  getTeamForUser,
  getDashboardMetrics,
  getProjectsByTeam,
  getTasksByTeam,
  getContactsByTeam,
} from '@/lib/db/queries';
import { isTrialActive } from '@/lib/payments/limits';
import { ReportsClient } from './reports-client';

export default async function ReportsPage() {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const teamData = await getTeamForUser(user.id);
  if (!teamData) throw new Error('Team not found');

  const [metrics, projects, taskRows, contacts] = await Promise.all([
    getDashboardMetrics(teamData.id),
    getProjectsByTeam(teamData.id),
    getTasksByTeam(teamData.id),
    getContactsByTeam(teamData.id),
  ]);

  // Serialize for client component
  const tasksForExport = taskRows.map((r) => ({
    id: r.task.id,
    title: r.task.title,
    projectName: r.projectName || '',
    status: r.task.status,
    priority: r.task.priority,
    assigneeName: r.assigneeName || '',
    dueDate: r.task.dueDate?.toISOString().split('T')[0] || '',
    createdAt: r.task.createdAt.toISOString().split('T')[0],
  }));

  const projectsForExport = projects.map((p) => {
    const projectTasks = taskRows.filter((t) => t.task.projectId === p.id);
    const completed = projectTasks.filter((t) => t.task.status === 'completed').length;
    return {
      id: p.id,
      name: p.name,
      status: p.status,
      startDate: p.startDate?.toISOString().split('T')[0] || '',
      endDate: p.endDate?.toISOString().split('T')[0] || '',
      totalTasks: projectTasks.length,
      completedTasks: completed,
    };
  });

  const contactsForExport = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email || '',
    phone: c.phone || '',
    company: c.company || '',
    jobTitle: c.jobTitle || '',
    status: c.status,
  }));

  const canExport = isTrialActive(teamData);

  return (
    <ReportsClient
      metrics={metrics}
      tasks={tasksForExport}
      projects={projectsForExport}
      contacts={contactsForExport}
      canExport={canExport}
    />
  );
}
