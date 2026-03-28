'use client';

import { useState, useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Calendar, Loader2 } from 'lucide-react';
import { createProject } from '@/lib/actions/projects';
import type { Project } from '@/lib/db/schema';
import Link from 'next/link';
import { projectStatusConfig, formatDate } from '@/lib/utils';

type TaskCount = { projectId: number; total: number; completed: number };

export function ProjectList({
  projects,
  taskCounts,
}: {
  projects: Project[];
  taskCounts: TaskCount[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    { error?: string; success?: string },
    FormData
  >(createProject, { error: '', success: '' });

  if (state.success && open) {
    setOpen(false);
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
          Projects
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your workspace.</DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="What is this project about?"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" />
                </div>
              </div>
              {state.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet.</p>
            <Button
              onClick={() => setOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create your first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const counts = taskCounts.find((c) => c.projectId === project.id);
            const total = counts?.total || 0;
            const completed = counts?.completed || 0;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            const status = projectStatusConfig[project.status] || projectStatusConfig.active;

            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <Badge variant="secondary" className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>
                            {completed} of {total} tasks
                          </span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(project.startDate, true)} —{' '}
                        {formatDate(project.endDate, true)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
