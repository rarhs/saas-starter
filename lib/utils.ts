import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Shared status/priority config ---

export const taskStatusColors: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
};

export const taskPriorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export const projectStatusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  on_hold: { label: 'On Hold', className: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-800' },
};

export const contactStatusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-800' },
  lead: { label: 'Lead', className: 'bg-blue-100 text-blue-800' },
  client: { label: 'Client', className: 'bg-purple-100 text-purple-800' },
};

// --- Shared formatters ---

export function formatDate(date: Date | null, includeYear = false): string {
  if (!date) return 'Not set';
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (includeYear) options.year = 'numeric';
  return new Date(date).toLocaleDateString('en-US', options);
}

export function formatStatus(status: string): string {
  return status.replaceAll('_', ' ');
}
