import { redirect } from 'next/navigation';
import { getUser, getTeamForUser, getTasksByTeam, getProjectsByTeam } from '@/lib/db/queries';
import { TaskList } from './task-list';

export default async function TasksPage() {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const teamData = await getTeamForUser(user.id);
  if (!teamData) throw new Error('Team not found');

  const [dbTasks, dbProjects] = await Promise.all([
    getTasksByTeam(teamData.id),
    getProjectsByTeam(teamData.id),
  ]);

  const taskRows = dbTasks.map((row) => ({
    id: row.task.id,
    title: row.task.title,
    status: row.task.status,
    priority: row.task.priority,
    projectId: row.task.projectId,
    projectName: row.projectName || 'Unknown',
    assigneeName: row.assigneeName || null,
    dueDate: row.task.dueDate,
  }));

  const projectOptions = dbProjects.map((p) => ({ id: p.id, name: p.name }));
  const memberOptions = teamData.teamMembers.map((m) => ({
    id: m.user.id,
    name: m.user.name || m.user.email,
  }));

  return <TaskList tasks={taskRows} projects={projectOptions} members={memberOptions} />;
}
