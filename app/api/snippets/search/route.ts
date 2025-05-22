import { NextResponse } from 'next/server';
import { getUser, getTeamForUser, searchSnippetsByEmbedding } from '@/lib/db/queries';
import { generateEmbedding } from '@/lib/ai/embeddings';
import { Snippet } from '@/lib/db/schema';
import { z } from 'zod';

const searchQuerySchema = z.string().min(1, "Search query cannot be empty.").max(200, "Search query is too long.");

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const validationResult = searchQuerySchema.safeParse(query);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: 'Invalid search query', details: validationResult.error.flatten() },
      { status: 400 }
    );
  }
  const validatedQuery = validationResult.data;


  try {
    // Generate embedding for the search query
    const queryVector = await generateEmbedding(validatedQuery);

    // Get user's team ID for context in search
    let userTeamId: number | null = null;
    const userTeam = await getTeamForUser(user.id);
    if (userTeam) {
      userTeamId = userTeam.id;
    }
    
    // Perform semantic search
    const results: Snippet[] = await searchSnippetsByEmbedding(
      queryVector,
      user.id,
      userTeamId // Pass user's team_id
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error during snippet search:', error);
    // Check if the error is due to embedding pipeline initialization
    if (error instanceof Error && error.message.includes('Embedding pipeline not available')) {
        return NextResponse.json(
            { error: 'Search functionality is currently unavailable. Please try again later.' },
            { status: 503 } // Service Unavailable
        );
    }
    return NextResponse.json(
      { error: 'Failed to search snippets' },
      { status: 500 }
    );
  }
}
