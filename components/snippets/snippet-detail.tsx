'use client';

import { Snippet } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Choose a style

// You might need to register languages you want to support if they are not common
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
// SyntaxHighlighter.registerLanguage('javascript', js);

interface SnippetDetailProps {
  snippet: Snippet;
  onEdit?: (snippet: Snippet) => void; // Optional: If editing is handled outside this component
  onDelete?: (snippetId: number) => Promise<void>; // Optional: If deleting is handled outside
  onClose?: () => void; // If displayed in a modal
  currentUserId?: number; // To check permissions for edit/delete
}

export function SnippetDetail({
  snippet,
  onEdit,
  onDelete,
  onClose,
  currentUserId,
}: SnippetDetailProps) {
  if (!snippet) return <p>Snippet not found.</p>;

  // Attempt to map language names to those supported by react-syntax-highlighter
  // This is a basic mapping and might need to be more comprehensive
  const getLanguageForHighlighter = (lang: string) => {
    const langLower = lang.toLowerCase();
    if (langLower === 'csharp') return 'csharp';
    if (langLower === 'cplusplus') return 'cpp';
    // Add more mappings as needed
    return langLower;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{snippet.title}</h1>
          <div className="text-sm text-muted-foreground">
            Language: <Badge variant="outline">{snippet.language}</Badge> |
            Visibility: <Badge variant="outline">{snippet.visibility}</Badge>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {snippet.description && (
        <div>
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-muted-foreground">{snippet.description}</p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold">Code</h2>
        <div className="p-4 rounded-md bg-gray-900 text-white"> {/* Dark background for code */}
          <SyntaxHighlighter
            language={getLanguageForHighlighter(snippet.language)}
            style={docco} // Or choose another style
            showLineNumbers
            wrapLines
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </div>

      {snippet.tags && Array.isArray(snippet.tags) && snippet.tags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {(snippet.tags as string[]).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Created: {new Date(snippet.createdAt).toLocaleString()} | Last
          Updated: {new Date(snippet.updatedAt).toLocaleString()}
        </p>
      </div>

      {currentUserId && snippet.userId === currentUserId && (onEdit || onDelete) && (
        <div className="flex justify-end space-x-2 mt-4">
          {onEdit && (
            <Button variant="outline" onClick={() => onEdit(snippet)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this snippet?')) {
                  await onDelete(snippet.id);
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
