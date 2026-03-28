import { redirect } from 'next/navigation';
import { Settings } from './settings';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Team Settings' };

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const teamData = await getTeamForUser(user.id);

  if (!teamData) {
    throw new Error('Team not found');
  }

  return <Settings teamData={teamData} />;
}
