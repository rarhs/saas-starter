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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Clock, Loader2, Trash2 } from 'lucide-react';
import { createTask, updateTaskStatus, deleteTask } from '@/lib/actions/tasks';
import { taskStatusColors, taskPriorityColors, formatDate, formatStatus } from '@/lib/utils';

type TaskRow = {
  id: number;
  title: string;
  status: string;
  priority: string;
  projectId: number;
  projectName: string;
  assigneeName: string | null;
  dueDate: Date | null;
};

type ProjectOption = { id: number; name: string };
type MemberOption = { id: number; name: string };

export function TaskList({
  tasks,
  projects,
  members,
}: {
  tasks: TaskRow[];
  projects: ProjectOption[];
  members: MemberOption[];
}) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    { error?: string; success?: string },
    FormData
  >(createTask, { error: '', success: '' });

  if (state.success && open) {
    setOpen(false);
  }

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (projectFilter !== 'all' && task.projectId !== Number(projectFilter)) return false;
    return true;
  });

  function handleStatusChange(taskId: number, newStatus: string) {
    const fd = new FormData();
    fd.set('taskId', String(taskId));
    fd.set('status', newStatus);
    startTransition(() => {
      updateTaskStatus({ error: '', success: '' }, fd);
    });
  }

  function handleDelete(taskId: number) {
    if (!confirm('Delete this task?')) return;
    const fd = new FormData();
    fd.set('taskId', String(taskId));
    startTransition(() => {
      deleteTask({ error: '', success: '' }, fd);
    });
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900">Tasks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a task and assign it to a team member.</DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="projectId">Project</Label>
                <select
                  id="projectId"
                  name="projectId"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name}
                    </option>
                  ))}
                </select>
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
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue="todo"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" name="dueDate" type="date" />
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
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the task..."
                  rows={3}
                />
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
                  'Create Task'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(statusFilter !== 'all' ||
              priorityFilter !== 'all' ||
              projectFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setProjectFilter('all');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => {
                const isOverdue =
                  task.status !== 'completed' &&
                  task.dueDate &&
                  new Date(task.dueDate) < new Date();

                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{task.title}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {task.projectName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{task.assigneeName || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={taskPriorityColors[task.priority]}
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 cursor-pointer ${taskStatusColors[task.status]}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_review">In Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}
                      >
                        {isOverdue && <Clock className="h-3 w-3" />}
                        {formatDate(task.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {tasks.length === 0
                      ? 'No tasks yet. Create a project first, then add tasks.'
                      : 'No tasks match the current filters.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
