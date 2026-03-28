import { notFound, redirect } from 'next/navigation';
import {
  getUser,
  getTeamForUser,
  getContactById,
  getProjectsForContact,
} from '@/lib/db/queries';
import { ContactDetail } from './contact-detail';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact Details' };

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const teamData = await getTeamForUser(user.id);
  if (!teamData) throw new Error('Team not found');

  const { id } = await params;
  const contactId = Number(id);
  const [contact, linkedProjects] = await Promise.all([
    getContactById(contactId, teamData.id),
    getProjectsForContact(contactId),
  ]);

  if (!contact) notFound();

  return <ContactDetail contact={contact} linkedProjects={linkedProjects} />;
}
