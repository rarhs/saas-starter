'use client';

import { useState, useEffect, FormEvent } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, X as ClearSearchIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { SnippetForm } from '@/components/snippets/snippet-form';
import { SnippetList } from '@/components/snippets/snippet-list';
import { SnippetDetail } from '@/components/snippets/snippet-detail';
import { Snippet, NewSnippet, User } from '@/lib/db/schema'; // Assuming User type is here

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SnippetsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // For controlled input
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState(''); // For triggering SWR


  // Fetch current user (replace with your actual user fetching logic)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session'); // Example endpoint
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user); 
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  // SWR hooks for fetching snippets
  // Adjust query params as needed (e.g., based on filters or user context)
  const {
    data: userSnippets,
    error: userSnippetsError,
    mutate: mutateUserSnippets,
  } = useSWR<Snippet[]>(currentUser ? `/api/snippets?userId=${currentUser.id}` : null, fetcher);

  const {
    data: publicSnippets,
    error: publicSnippetsError,
    mutate: mutatePublicSnippets,
  } = useSWR<Snippet[]>('/api/snippets?visibility=public', fetcher);
  
  const {
    data: teamSnippets,
    error: teamSnippetsError,
    mutate: mutateTeamSnippets,
  } = useSWR<Snippet[]>(
    currentUser && currentUser.teamId
      ? `/api/snippets?teamId=${currentUser.teamId}`
      : null,
    fetcher
  );

  // SWR hook for search results
  const {
    data: searchResults,
    error: searchError,
    mutate: mutateSearchResults, // May not be directly used unless we want to manually trigger re-search
    isLoading: isSearchLoading,
  } = useSWR<Snippet[]>(
    submittedSearchQuery // Only fetch if there's a submitted search query
      ? `/api/snippets/search?q=${encodeURIComponent(submittedSearchQuery)}`
      : null,
    fetcher
  );


  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: NewSnippet | Partial<Snippet>) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingSnippet) {
        response = await fetch(`/api/snippets/${editingSnippet.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch('/api/snippets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save snippet');
      }

      await mutateUserSnippets(); 
      
      const newVisibility = 'visibility' in data ? data.visibility : editingSnippet?.visibility;
      const oldVisibility = editingSnippet?.visibility;
      const relevantTeamId = 'teamId' in data ? data.teamId : editingSnippet?.teamId;


      if (newVisibility === 'public' || oldVisibility === 'public') {
        await mutatePublicSnippets();
      }
      // Mutate team snippets if the snippet is/was a team snippet for the current user's team
      if (currentUser?.teamId && ( (newVisibility === 'team' && relevantTeamId === currentUser.teamId) || (oldVisibility === 'team' && editingSnippet?.teamId === currentUser.teamId) ) ) {
        await mutateTeamSnippets();
      }
      
      // If visibility changed, ensure all affected lists are mutated
      if (editingSnippet && oldVisibility !== newVisibility) {
        // From public to something else
        if (oldVisibility === 'public' && newVisibility !== 'public') await mutatePublicSnippets();
        // From team to something else (for current user's team)
        if (oldVisibility === 'team' && editingSnippet.teamId === currentUser?.teamId && newVisibility !== 'team') await mutateTeamSnippets();
         // To public from something else
        if (newVisibility === 'public' && oldVisibility !== 'public') await mutatePublicSnippets();
        // To team from something else (for current user's team)
        if (newVisibility === 'team' && relevantTeamId === currentUser?.teamId && oldVisibility !== 'team') await mutateTeamSnippets();
      }


      setIsFormOpen(false);
      setEditingSnippet(null);
    } catch (error) {
      console.error('Error submitting snippet:', error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setIsDetailOpen(true);
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setSelectedSnippet(null); // Close detail view if open
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleDeleteSnippet = async (snippetId: number) => {
    try {
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete snippet');
      }
      await mutateUserSnippets();
      
      const deletedSnippetFromState = combinedSnippets().find(s => s.id === snippetId);

      if (deletedSnippetFromState) {
        if (deletedSnippetFromState.visibility === 'public') {
          await mutatePublicSnippets();
        }
        if (deletedSnippetFromState.visibility === 'team' && deletedSnippetFromState.teamId === currentUser?.teamId) {
          await mutateTeamSnippets();
        }
      } else {
        // Fallback if not found in combined state, mutate all potentially affected
        await mutatePublicSnippets();
        if (currentUser?.teamId) await mutateTeamSnippets();
      }

      if (selectedSnippet && selectedSnippet.id === snippetId) {
        setIsDetailOpen(false);
        setSelectedSnippet(null);
      }
    } catch (error) {
      console.error('Error deleting snippet:', error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const openCreateForm = () => {
    setEditingSnippet(null);
    setIsFormOpen(true);
  };
  
  const combinedSnippets = () => {
    const allSnippets = new Map<number, Snippet>();
    (userSnippets || []).forEach(s => allSnippets.set(s.id, s));
    (publicSnippets || []).forEach(s => allSnippets.set(s.id, s));
    (teamSnippets || []).forEach(s => { 
      // Add to map if not already present (e.g. if it's user's own team snippet, userSnippets would have it)
      if (!allSnippets.has(s.id)) {
        allSnippets.set(s.id, s);
      }
    });
    return Array.from(allSnippets.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  if (userSnippetsError || publicSnippetsError || teamSnippetsError) {
    console.error({ userSnippetsError, publicSnippetsError, teamSnippetsError });
    return <div>Error loading snippets. Please try again.</div>;
  }

  // Initial loading state: currentUser is not yet available, or public snippets are not yet available.
  if (!currentUser || (!publicSnippets && !publicSnippetsError)) {
    return <div>Loading essential data...</div>;
  }

  // User-specific loading states (once currentUser is available)
  if (currentUser && !userSnippets && !userSnippetsError) {
    return <div>Loading your snippets...</div>;
  }
  if (currentUser && currentUser.teamId && !teamSnippets && !teamSnippetsError) {
    return <div>Loading team snippets...</div>;
  }
  
  // Fallback loading state if any data is still missing (should be covered by above)
  if (!userSnippets && !publicSnippets && (currentUser && currentUser.teamId && !teamSnippets)) {
    return <div>Loading remaining snippets...</div>;
  }


  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) { // Avoid submitting empty queries
      setSubmittedSearchQuery(''); // Clear previous results if query is cleared
      return;
    }
    setSubmittedSearchQuery(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSubmittedSearchQuery('');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Code Snippets</h1>
        <Button onClick={openCreateForm}>Create New Snippet</Button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-8"> {/* Increased margin */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search your snippets with AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-20" // Make space for both icons or a wider button
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-10 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-primary"
              onClick={clearSearch}
            >
              <ClearSearchIcon className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
          <Button
            type="submit"
            variant="ghost" // Changed to ghost to be less intrusive, or use a specific search button style
            size="icon"
            className="absolute right-0 top-1/2 h-full w-10 -translate-y-1/2 rounded-l-none text-muted-foreground hover:text-primary"
            disabled={!searchQuery.trim()}
          >
            <SearchIcon className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </form>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSnippet ? 'Edit Snippet' : 'Create New Snippet'}
            </DialogTitle>
          </DialogHeader>
          <SnippetForm
            snippet={editingSnippet || undefined}
            currentUser={currentUser} // Pass currentUser
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
             {/* Title can be part of SnippetDetail or here */}
          </DialogHeader>
          {selectedSnippet && (
            <SnippetDetail
              snippet={selectedSnippet}
              onEdit={currentUser && selectedSnippet.userId === currentUser.id ? handleEditSnippet : undefined}
              onDelete={currentUser && selectedSnippet.userId === currentUser.id ? handleDeleteSnippet : undefined}
              onClose={() => setIsDetailOpen(false)}
              currentUserId={currentUser?.id}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Display Logic for Search vs. Default List */}
      {submittedSearchQuery ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Search Results for: "{submittedSearchQuery}"
            </h2>
            {/* Button to clear search results and show all snippets */}
            <Button variant="outline" size="sm" onClick={clearSearch}>
              Clear Search & Show All
            </Button>
          </div>
          {isSearchLoading && <p>Searching snippets...</p>}
          {searchError && (
            <p className="text-red-500">
              Error searching snippets. Please try again.
            </p>
          )}
          {searchResults && searchResults.length === 0 && !isSearchLoading && (
            <p>No snippets found matching your search query.</p>
          )}
          {searchResults && searchResults.length > 0 && (
            <SnippetList
              snippets={searchResults}
              onView={handleViewSnippet}
              onEdit={handleEditSnippet}
              // Consider how delete interacts with search results.
              // Deleting from search results should ideally remove from the main list too (SWR handles this if keys are consistent or revalidated).
              onDelete={handleDeleteSnippet} 
              currentUserId={currentUser?.id}
            />
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">All Snippets</h2>
          {( (userSnippets && userSnippets.length > 0) || (publicSnippets && publicSnippets.length > 0) || (teamSnippets && teamSnippets.length > 0) ) ? (
            <SnippetList
              snippets={combinedSnippets()}
              onView={handleViewSnippet}
              onEdit={handleEditSnippet}
              onDelete={handleDeleteSnippet}
              currentUserId={currentUser?.id}
            />
          ) : (
             !userSnippetsError && !publicSnippetsError && !teamSnippetsError && /* Only show if no errors */ (
              <p>No snippets found. Create your first snippet!</p>
            )
          )}
        </div>
      )}

      {/* Example of how you might display different lists if needed 
      {userSnippets && userSnippets.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">My Private Snippets</h2>
          <SnippetList
            snippets={userSnippets.filter(s => s.visibility === 'private' && s.userId === currentUser?.id)}
            onView={handleViewSnippet}
            onEdit={handleEditSnippet}
            onDelete={handleDeleteSnippet}
            currentUserId={currentUser?.id}
          />
        </>
      )}

      {publicSnippets && publicSnippets.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">Public Snippets</h2>
          <SnippetList
            snippets={publicSnippets}
            onView={handleViewSnippet}
            onEdit={handleEditSnippet} // Potentially only if owner
            onDelete={handleDeleteSnippet} // Potentially only if owner
            currentUserId={currentUser?.id}
          />
        </>
      )}
      */}

    </div>
  );
}
