import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  Users,
  Clock,
} from 'lucide-react';
import {
  getUser,
  getTeamForUser,
  getDashboardMetrics,
  getRecentTasks,
  getUpcomingDeadlines,
} from '@/lib/db/queries';
import Link from 'next/link';
import { taskStatusColors, formatDate, formatStatus } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const teamData = await getTeamForUser(user.id);
  if (!teamData) throw new Error('Team not found');

  const [metrics, recentTasks, upcoming] = await Promise.all([
    getDashboardMetrics(teamData.id),
    getRecentTasks(teamData.id, 5),
    getUpcomingDeadlines(teamData.id),
  ]);

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-3xl font-bold">{metrics.activeProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.totalProjects} total
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <FolderKanban className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Tasks</p>
                <p className="text-3xl font-bold">
                  {metrics.totalTasks - metrics.completedTasks}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.completedTasks} completed
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Tasks</p>
                <p className={`text-3xl font-bold ${metrics.overdueTasks > 0 ? 'text-red-600' : ''}`}>
                  {metrics.overdueTasks}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  need attention
                </p>
              </div>
              <div className={`rounded-full p-3 ${metrics.overdueTasks > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <AlertTriangle className={`h-6 w-6 ${metrics.overdueTasks > 0 ? 'text-red-600' : 'text-gray-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contacts</p>
                <p className="text-3xl font-bold">{metrics.totalContacts}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.teamMembers} team member{metrics.teamMembers !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Status Distribution */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Task Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.totalTasks > 0 ? (
            <div className="space-y-3">
              {[
                { label: 'To Do', count: metrics.todoTasks, color: 'bg-gray-400' },
                { label: 'In Progress', count: metrics.inProgressTasks, color: 'bg-blue-500' },
                { label: 'In Review', count: metrics.inReviewTasks, color: 'bg-yellow-500' },
                { label: 'Completed', count: metrics.completedTasks, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-24">{item.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all`}
                      style={{ width: `${(item.count / metrics.totalTasks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tasks yet. <Link href="/dashboard/projects" className="text-orange-500 hover:underline">Create a project</Link> to get started.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Tasks</CardTitle>
            <Link href="/dashboard/tasks" className="text-sm text-orange-500 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((row) => (
                  <div key={row.task.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{row.task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.projectName}{row.assigneeName ? ` · ${row.assigneeName}` : ''}
                      </p>
                    </div>
                    <Badge variant="secondary" className={taskStatusColors[row.task.status]}>
                      {formatStatus(row.task.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No tasks yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Deadlines</CardTitle>
            <Link href="/dashboard/tasks" className="text-sm text-orange-500 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {upcoming.filter((r) => r.task.dueDate).length > 0 ? (
              <div className="space-y-4">
                {upcoming
                  .filter((r) => r.task.dueDate)
                  .map((row) => {
                    const isOverdue = row.task.dueDate && new Date(row.task.dueDate) < new Date();
                    return (
                      <div key={row.task.id} className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{row.task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {row.projectName} {row.assigneeName ? `· ${row.assigneeName}` : ''}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 text-xs shrink-0 ${isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                          <Clock className="h-3 w-3" />
                          {isOverdue ? 'Overdue: ' : ''}{formatDate(row.task.dueDate)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No upcoming deadlines.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
