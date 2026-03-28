'use client';

import { useState, useActionState, startTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Search, Mail, Phone, Loader2, Trash2 } from 'lucide-react';
import { createContact, deleteContact } from '@/lib/actions/contacts';
import type { Contact } from '@/lib/db/schema';
import Link from 'next/link';
import { contactStatusConfig } from '@/lib/utils';

export function ContactList({ contacts }: { contacts: Contact[] }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    { error?: string; success?: string },
    FormData
  >(createContact, { error: '', success: '' });

  if (state.success && open) {
    setOpen(false);
  }

  function handleDelete(contactId: number) {
    if (!confirm('Delete this contact?')) return;
    const fd = new FormData();
    fd.set('contactId', String(contactId));
    startTransition(() => {
      deleteContact({ error: '', success: '' }, fd);
    });
  }

  const filteredContacts = contacts.filter((contact) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      contact.name.toLowerCase().includes(q) ||
      contact.email?.toLowerCase().includes(q) ||
      contact.company?.toLowerCase().includes(q) ||
      contact.jobTitle?.toLowerCase().includes(q)
    );
  });

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
          Contacts
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>Add a new contact to your address book.</DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Full name" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" placeholder="+1-555-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" placeholder="Company name" />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" name="jobTitle" placeholder="e.g. CTO" />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="client">Client</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" name="notes" placeholder="Any notes about this contact..." rows={2} />
              </div>
              {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Contact'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, email, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No contacts yet.</p>
              <Button
                onClick={() => setOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first contact
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => {
                  const st = contactStatusConfig[contact.status] || contactStatusConfig.active;
                  return (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Link href={`/dashboard/contacts/${contact.id}`} className="hover:underline">
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.jobTitle}</p>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{contact.company || '—'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {contact.email && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={st.className}>{st.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                          onClick={() => handleDelete(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredContacts.length === 0 && contacts.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No contacts found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
