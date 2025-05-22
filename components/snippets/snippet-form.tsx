'use client';

import { useState, useEffect, useContext } from 'react'; // Assuming a UserContext or similar for teamId
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Snippet, NewSnippet } from '@/lib/db/schema'; // Assuming types are here

import { User } from '@/lib/db/schema'; // Assuming User type includes team info

interface SnippetFormProps {
  snippet?: Snippet;
  currentUser?: User | null; // Pass current user to access teamId
  onSubmit: (data: NewSnippet | Partial<NewSnippet>) => Promise<void>;
  isSubmitting: boolean;
  onClose?: () => void;
}

const commonLanguages = [
  'JavaScript',
  'Python',
  'Java',
  'TypeScript',
  'CSharp',
  'CPlusPlus',
  'PHP',
  'Ruby',
  'Go',
  'Swift',
  'Kotlin',
  'Rust',
  'SQL',
  'HTML',
  'CSS',
];

export function SnippetForm({
  snippet,
  onSubmit,
  isSubmitting,
  onClose,
  currentUser,
}: SnippetFormProps) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'team' | 'public'>(
    'private'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setCode(snippet.code);
      setLanguage(snippet.language);
      setDescription(snippet.description || '');
      setTags(Array.isArray(snippet.tags) ? snippet.tags.join(', ') : '');
      setVisibility(
        snippet.visibility as 'private' | 'team' | 'public' | undefined || 'private'
      );
    } else {
      // Reset form for new snippet
      setTitle('');
      setCode('');
      setLanguage('');
      setDescription('');
      setTags('');
      setVisibility('private');
    }
  }, [snippet]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!code.trim()) newErrors.code = 'Code is required';
    if (!language.trim()) newErrors.language = 'Language is required';
    if (!visibility) newErrors.visibility = 'Visibility is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const snippetData = {
      title,
      code,
      language,
      description,
      tags: tags.split(',').map((tag) => tag.trim()).filter(tag => tag),
      visibility,
      teamId: visibility === 'team' && currentUser?.teamId ? currentUser.teamId : null,
    };
    
    const dataToSubmit: Partial<Snippet> | NewSnippet = snippet 
      ? { ...snippetData, id: snippet.id } 
      : (snippetData as NewSnippet);

    // Ensure teamId is explicitly null if not a team snippet or no teamId is available
    if (dataToSubmit.visibility !== 'team' || !currentUser?.teamId) {
      dataToSubmit.teamId = null;
    }


    await onSubmit(dataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Snippet"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="code">Code</Label>
        <Textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="console.log('Hello, world!');"
          rows={10}
        />
        {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
      </div>

      <div>
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={(value) => setLanguage(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {commonLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
             <SelectItem value="Other">Other (Specify)</SelectItem>
          </SelectContent>
        </Select>
        {language === 'Other' && (
            <Input
                id="language-other"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Specify language"
                className="mt-2"
            />
        )}
        {errors.language && (
          <p className="text-red-500 text-sm">{errors.language}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of what this snippet does."
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (Comma-separated, Optional)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="javascript, react, utility"
        />
      </div>

      <div>
        <Label>Visibility</Label>
        <RadioGroup
          value={visibility}
          onValueChange={(value) =>
            setVisibility(value as 'private' | 'team' | 'public')
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">Private</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="team"
              id="team"
              disabled={!currentUser?.teamId}
            />
            <Label htmlFor="team" className={!currentUser?.teamId ? 'text-muted-foreground' : ''}>
              Team {!currentUser?.teamId ? '(No team assigned)' : ''}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Public</Label>
          </div>
        </RadioGroup>
        {errors.visibility && (
          <p className="text-red-500 text-sm">{errors.visibility}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (snippet ? 'Saving...' : 'Creating...') : (snippet ? 'Save Changes' : 'Create Snippet')}
        </Button>
      </div>
    </form>
  );
}
