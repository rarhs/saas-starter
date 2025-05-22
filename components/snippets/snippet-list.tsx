'use client';

import { Snippet } from '@/lib/db/schema'; // Assuming types are here
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // For tags and visibility

interface SnippetListProps {
  snippets: Snippet[];
  onView: (snippet: Snippet) => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippetId: number) => Promise<void>;
  currentUserId?: number; // To check permissions for edit/delete
}

export function SnippetList({
  snippets,
  onView,
  onEdit,
  onDelete,
  currentUserId,
}: SnippetListProps) {
  if (snippets.length === 0) {
    return <p>No snippets found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {snippets.map((snippet) => (
        <Card key={snippet.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="hover:underline cursor-pointer" onClick={() => onView(snippet)}>
                {snippet.title}
              </CardTitle>
              <Badge variant="outline">{snippet.visibility}</Badge>
            </div>
            <CardDescription>{snippet.language}</CardDescription>
          </CardHeader>
          <CardContent>
            {snippet.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {snippet.description}
              </p>
            )}
            {snippet.tags && Array.isArray(snippet.tags) && snippet.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {(snippet.tags as string[]).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => onView(snippet)}>
              View
            </Button>
            {currentUserId && snippet.userId === currentUserId && (
              <>
                <Button variant="ghost" size="sm" onClick={() => onEdit(snippet)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async (e) => {
                    e.stopPropagation(); // Prevent card click event
                    if (window.confirm('Are you sure you want to delete this snippet?')) {
                      await onDelete(snippet.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
