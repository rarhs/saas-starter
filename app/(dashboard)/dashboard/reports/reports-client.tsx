'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileDown,
  Printer,
  CheckSquare,
  FolderKanban,
  Users,
  BarChart3,
} from 'lucide-react';

type Metrics = {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalContacts: number;
};

type TaskExport = {
  id: number;
  title: string;
  projectName: string;
  status: string;
  priority: string;
  assigneeName: string;
  dueDate: string;
  createdAt: string;
};

type ProjectExport = {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  totalTasks: number;
  completedTasks: number;
};

type ContactExport = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  status: string;
};

function toCSV(headers: string[], rows: string[][]): string {
  return [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((row) => row.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportsClient({
  metrics,
  tasks,
  projects,
  contacts,
  canExport,
}: {
  metrics: Metrics;
  tasks: TaskExport[];
  projects: ProjectExport[];
  contacts: ContactExport[];
  canExport: boolean;
}) {
  const reports = [
    {
      title: 'Task Summary',
      description: 'All tasks with status, priority, assignee, and project information.',
      icon: CheckSquare,
      count: tasks.length,
      countLabel: 'tasks',
      onExport: () => {
        const csv = toCSV(
          ['ID', 'Title', 'Project', 'Status', 'Priority', 'Assignee', 'Due Date', 'Created'],
          tasks.map((t) => [String(t.id), t.title, t.projectName, t.status, t.priority, t.assigneeName, t.dueDate, t.createdAt])
        );
        downloadCSV(csv, `tasks-report-${new Date().toISOString().split('T')[0]}.csv`);
      },
    },
    {
      title: 'Project Overview',
      description: 'All projects with task counts, completion progress, and timelines.',
      icon: FolderKanban,
      count: projects.length,
      countLabel: 'projects',
      onExport: () => {
        const csv = toCSV(
          ['ID', 'Name', 'Status', 'Start Date', 'End Date', 'Total Tasks', 'Completed Tasks'],
          projects.map((p) => [String(p.id), p.name, p.status, p.startDate, p.endDate, String(p.totalTasks), String(p.completedTasks)])
        );
        downloadCSV(csv, `projects-report-${new Date().toISOString().split('T')[0]}.csv`);
      },
    },
    {
      title: 'Contact List',
      description: 'All contacts with company, contact details, and status.',
      icon: Users,
      count: contacts.length,
      countLabel: 'contacts',
      onExport: () => {
        const csv = toCSV(
          ['ID', 'Name', 'Email', 'Phone', 'Company', 'Job Title', 'Status'],
          contacts.map((c) => [String(c.id), c.name, c.email, c.phone, c.company, c.jobTitle, c.status])
        );
        downloadCSV(csv, `contacts-report-${new Date().toISOString().split('T')[0]}.csv`);
      },
    },
  ];

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900">Reports</h1>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print Page
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            <CardTitle>Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <p className="text-2xl font-bold">{metrics.activeProjects}</p>
              <p className="text-xs text-muted-foreground">Active Projects</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <p className="text-2xl font-bold">{metrics.totalTasks - metrics.completedTasks}</p>
              <p className="text-xs text-muted-foreground">Open Tasks</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <p className="text-2xl font-bold">{metrics.completedTasks}</p>
              <p className="text-xs text-muted-foreground">Completed Tasks</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <p className="text-2xl font-bold">{metrics.totalContacts}</p>
              <p className="text-xs text-muted-foreground">Total Contacts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <report.icon className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-base">{report.title}</CardTitle>
              </div>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {report.count} {report.countLabel} will be exported
              </p>
              {canExport ? (
                <Button
                  onClick={report.onExport}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Export requires Pro plan</p>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/pricing">Upgrade to Pro</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
