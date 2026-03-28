import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Building, Briefcase } from 'lucide-react';
import {
  getUser,
  getTeamForUser,
  getContactById,
  getProjectsForContact,
} from '@/lib/db/queries';
import Link from 'next/link';
import { contactStatusConfig, formatStatus } from '@/lib/utils';
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

  const status = contactStatusConfig[contact.status] || contactStatusConfig.active;

  return (
    <section className="flex-1 p-4 lg:p-8">
      <Link
        href="/dashboard/contacts"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Contacts
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
              {contact.name}
            </h1>
            <Badge variant="secondary" className={status.className}>
              {status.label}
            </Badge>
          </div>
          {(contact.jobTitle || contact.company) && (
            <p className="text-sm text-muted-foreground mt-1">
              {[contact.jobTitle, contact.company].filter(Boolean).join(' at ')}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contact.email && (
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{contact.email}</p>
                </div>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{contact.phone}</p>
                </div>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <Building className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm">{contact.company}</p>
                </div>
              </div>
            )}
            {contact.jobTitle && (
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Job Title</p>
                  <p className="text-sm">{contact.jobTitle}</p>
                </div>
              </div>
            )}
            {!contact.email && !contact.phone && !contact.company && !contact.jobTitle && (
              <p className="text-sm text-muted-foreground">No contact details added yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {contact.notes ? (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No notes added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {linkedProjects.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Linked Projects ({linkedProjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {linkedProjects.map((row) => (
                <Link
                  key={row.project.id}
                  href={`/dashboard/projects/${row.project.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{row.project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.project.description?.slice(0, 80)}
                      {row.project.description && row.project.description.length > 80 ? '...' : ''}
                    </p>
                  </div>
                  <Badge variant="secondary">{formatStatus(row.project.status)}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
