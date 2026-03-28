'use client';

import { useState, useActionState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, Calendar, Clock, Plus, Loader2, Trash2, Pencil } from 'lucide-react';
import { createTask } from '@/lib/actions/tasks';
import { deleteProject, updateProject } from '@/lib/actions/projects';
import type { Project, Task } from '@/lib/db/schema';
import Link from 'next/link';
import {
  taskStatusColors,
  taskPriorityColors,
  projectStatusConfig,
  formatDate,
  formatStatus,
} from '@/lib/utils';

type TaskRow = {
  task: Task;
  assigneeName: string | null;
};

type MemberOption = { id: number; name: string };

export function ProjectDetail({
  project,
  taskRows,
  members,
}: {
  project: Project;
  taskRows: TaskRow[];
  members: MemberOption[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    { error?: string; success?: string },
    FormData
  >(createTask, { error: '', success: '' });
  const [editState, editAction, isEditPending] = useActionState<
    { error?: string; success?: string },
    FormData
  >(updateProject, { error: '', success: '' });

  if (state.success && open) {
    setOpen(false);
  }
  if (editState.success && editOpen) {
    setEditOpen(false);
  }

  const completedTasks = taskRows.filter((r) => r.task.status === 'completed').length;
  const progress =
    taskRows.length > 0 ? Math.round((completedTasks / taskRows.length) * 100) : 0;
  const status = projectStatusConfig[project.status] || projectStatusConfig.active;

  function handleDeleteProject() {
    if (!confirm(`Delete "${project.name}" and all its tasks? This cannot be undone.`)) return;
    const fd = new FormData();
    fd.set('projectId', String(project.id));
    startTransition(async () => {
      await deleteProject({ error: '', success: '' }, fd);
      router.push('/dashboard/projects');
    });
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-6">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
                {project.name}
              </h1>
              <Badge variant="secondary" className={status.className}>
                {status.label}
              </Badge>
            </div>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                {project.description}
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
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogDescription>Update project details.</DialogDescription>
                </DialogHeader>
                <form action={editAction} className="space-y-4">
                  <input type="hidden" name="projectId" value={String(project.id)} />
                  <div>
                    <Label htmlFor="edit-name">Project Name</Label>
                    <Input id="edit-name" name="name" defaultValue={project.name} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea id="edit-description" name="description" defaultValue={project.description || ''} rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <select
                      id="edit-status"
                      name="status"
                      defaultValue={project.status}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="edit-startDate">Start Date</Label>
                      <Input
                        id="edit-startDate"
                        name="startDate"
                        type="date"
                        defaultValue={project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-endDate">End Date</Label>
                      <Input
                        id="edit-endDate"
                        name="endDate"
                        type="date"
                        defaultValue={project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''}
                      />
                    </div>
                  </div>
                  {editState.error && <p className="text-red-500 text-sm">{editState.error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Task to {project.name}</DialogTitle>
                  <DialogDescription>Create a new task for this project.</DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="projectId" value={String(project.id)} />
                  <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" name="title" placeholder="Enter task title" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        name="priority"
                        defaultValue="medium"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="assigneeId">Assignee</Label>
                      <select
                        id="assigneeId"
                        name="assigneeId"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {members.map((m) => (
                          <option key={m.id} value={String(m.id)}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" name="dueDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea id="description" name="description" placeholder="Describe the task..." rows={2} />
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
                      'Add Task'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteProject}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              Timeline
            </div>
            <p className="text-sm font-medium">
              {formatDate(project.startDate, true)} — {formatDate(project.endDate, true)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Progress</p>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} of {taskRows.length} tasks done
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge variant="secondary" className={status.className}>
              {status.label}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks ({taskRows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {taskRows.length > 0 ? (
            <div className="space-y-3">
              {taskRows.map((row) => (
                <div
                  key={row.task.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{row.task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {row.assigneeName && (
                        <span className="text-xs text-muted-foreground">
                          {row.assigneeName}
                        </span>
                      )}
                      {row.task.dueDate && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(row.task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={taskPriorityColors[row.task.priority]}>
                      {row.task.priority}
                    </Badge>
                    <Badge variant="secondary" className={taskStatusColors[row.task.status]}>
                      {formatStatus(row.task.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No tasks yet. Click &quot;Add Task&quot; to create one.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
