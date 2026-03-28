import { redirect } from 'next/navigation';
import { getUser, getTeamForUser, getContactsByTeam } from '@/lib/db/queries';
import { ContactList } from './contact-list';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contacts' };

export default async function ContactsPage() {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const teamData = await getTeamForUser(user.id);
  if (!teamData) throw new Error('Team not found');

  const dbContacts = await getContactsByTeam(teamData.id);

  return <ContactList contacts={dbContacts} />;
}
