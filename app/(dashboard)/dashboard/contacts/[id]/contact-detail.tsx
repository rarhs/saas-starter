'use client';

import { useState, useActionState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Mail, Phone, Building, Briefcase, Pencil, Trash2, Loader2 } from 'lucide-react';
import { updateContact, deleteContact } from '@/lib/actions/contacts';
import type { Contact, Project } from '@/lib/db/schema';
import Link from 'next/link';
import { contactStatusConfig, formatStatus } from '@/lib/utils';

type LinkedProject = { project: Project };

export function ContactDetail({
  contact,
  linkedProjects,
}: {
  contact: Contact;
  linkedProjects: LinkedProject[];
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [editState, editAction, isEditPending] = useActionState<
    { error?: string; success?: string },
    FormData
  >(updateContact, { error: '', success: '' });

  if (editState.success && editOpen) {
    setEditOpen(false);
  }

  function handleDelete() {
    if (!confirm(`Delete "${contact.name}"? This cannot be undone.`)) return;
    const fd = new FormData();
    fd.set('contactId', String(contact.id));
    startTransition(async () => {
      await deleteContact({ error: '', success: '' }, fd);
      router.push('/dashboard/contacts');
    });
  }

  const status = contactStatusConfig[contact.status] || contactStatusConfig.active;

  const infoItems = [
    { icon: Mail, label: 'Email', value: contact.email },
    { icon: Phone, label: 'Phone', value: contact.phone },
    { icon: Building, label: 'Company', value: contact.company },
    { icon: Briefcase, label: 'Job Title', value: contact.jobTitle },
  ].filter((item) => item.value);

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
        <div className="flex items-center gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Contact</DialogTitle>
                <DialogDescription>Update contact details.</DialogDescription>
              </DialogHeader>
              <form action={editAction} className="space-y-4">
                <input type="hidden" name="contactId" value={String(contact.id)} />
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input id="edit-name" name="name" defaultValue={contact.name} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" name="email" type="email" defaultValue={contact.email || ''} />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input id="edit-phone" name="phone" defaultValue={contact.phone || ''} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-company">Company</Label>
                    <Input id="edit-company" name="company" defaultValue={contact.company || ''} />
                  </div>
                  <div>
                    <Label htmlFor="edit-jobTitle">Job Title</Label>
                    <Input id="edit-jobTitle" name="jobTitle" defaultValue={contact.jobTitle || ''} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    name="status"
                    defaultValue={contact.status}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="lead">Lead</option>
                    <option value="active">Active</option>
                    <option value="client">Client</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    name="notes"
                    defaultValue={contact.notes || ''}
                    rows={3}
                    placeholder="Add notes about this contact..."
                  />
                </div>
                {editState.error && <p className="text-red-500 text-sm">{editState.error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={isEditPending}
                >
                  {isEditPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {infoItems.length > 0 ? (
              infoItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <item.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No contact details added yet. Click Edit to add them.
              </p>
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
              <p className="text-sm text-muted-foreground">
                No notes added yet. Click Edit to add notes.
              </p>
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
