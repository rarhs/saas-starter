import { redirect } from 'next/navigation';
import { getUser, getTeamForUser, getProjectsByTeam, getTasksByTeam } from '@/lib/db/queries';
import { ProjectList } from './project-list';

export default async function ProjectsPage() {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const teamData = await getTeamForUser(user.id);
  if (!teamData) throw new Error('Team not found');

  const [dbProjects, dbTasks] = await Promise.all([
    getProjectsByTeam(teamData.id),
    getTasksByTeam(teamData.id),
  ]);

  // Count tasks per project
  const taskCounts = dbProjects.map((project) => {
    const projectTasks = dbTasks.filter((t) => t.task.projectId === project.id);
    const completed = projectTasks.filter((t) => t.task.status === 'completed').length;
    return { projectId: project.id, total: projectTasks.length, completed };
  });

  return <ProjectList projects={dbProjects} taskCounts={taskCounts} />;
}
