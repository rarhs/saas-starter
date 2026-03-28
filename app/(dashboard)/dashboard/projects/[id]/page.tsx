import { notFound, redirect } from 'next/navigation';
import {
  getUser,
  getTeamForUser,
  getProjectById,
  getTasksByProject,
} from '@/lib/db/queries';
import { ProjectDetail } from './project-detail';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const teamData = await getTeamForUser(user.id);
  if (!teamData) throw new Error('Team not found');

  const { id } = await params;
  const [project, taskRows] = await Promise.all([
    getProjectById(Number(id), teamData.id),
    getTasksByProject(Number(id), teamData.id),
  ]);

  if (!project) notFound();

  const members = teamData.teamMembers.map((m) => ({
    id: m.user.id,
    name: m.user.name || m.user.email,
  }));

  return <ProjectDetail project={project} taskRows={taskRows} members={members} />;
}
