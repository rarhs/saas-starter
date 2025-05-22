import { desc, and, eq, isNull, or } from 'drizzle-orm';
import { db } from './drizzle';
import {
  activityLogs,
  teamMembers,
  teams,
  users,
  snippets,
  Snippet,
  NewSnippet,
  teams, // Added for consistency if needed, already present earlier
} from './schema';
import { sql } from 'drizzle-orm'; // For pgvector functions if ever used
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { generateEmbedding } from '@/lib/ai/embeddings'; // Import embedding utility

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}

// Common selection set for snippets, excluding embeddings
export const snippetSelection = {
  id: snippets.id,
  title: snippets.title,
  code: snippets.code,
  language: snippets.language,
  description: snippets.description,
  tags: snippets.tags,
  userId: snippets.userId,
  teamId: snippets.teamId,
  visibility: snippets.visibility,
  createdAt: snippets.createdAt,
  updatedAt: snippets.updatedAt,
};


// Snippet Queries

function snippetToTextForEmbedding(snippet: Partial<Snippet> | NewSnippet): string {
  // Ensure tags is an array of strings before joining
  const tagsString = Array.isArray(snippet.tags) ? snippet.tags.join(', ') : '';
  return `Title: ${snippet.title || ''}\nLanguage: ${snippet.language || ''}\nDescription: ${snippet.description || ''}\nTags: ${tagsString}\nCode:\n${snippet.code || ''}`;
}

export async function createSnippet(data: NewSnippet): Promise<Omit<Snippet, 'embedding'>> {
  const textForEmbedding = snippetToTextForEmbedding(data);
  let embeddingJson: string | null = null;
  try {
    const embeddingVector = await generateEmbedding(textForEmbedding);
    embeddingJson = JSON.stringify(embeddingVector);
  } catch (error) {
    console.error('Failed to generate embedding for new snippet:', error);
    // Decide if you want to proceed without embedding or throw error
    // For now, proceeding without embedding, will be stored as NULL
  }

  const result = await db
    .insert(snippets)
    .values({ ...data, embedding: embeddingJson })
    .returning(snippetSelection); // Use selection set
  return result[0];
}

export async function getSnippetById(
  snippetId: number,
  userId: number
): Promise<Omit<Snippet, 'embedding'> | null> {
  const result = await db
    .select(snippetSelection) // Use selection set
    .from(snippets)
    .where(eq(snippets.id, snippetId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const snippet = result[0];

  // Check ownership or team access
  if (snippet.userId === userId) {
    return snippet;
  }

  if (snippet.teamId) {
    const teamMember = await db
      .select()
      .from(teamMembers)
      .where(
        and(eq(teamMembers.teamId, snippet.teamId), eq(teamMembers.userId, userId))
      )
      .limit(1);
    if (teamMember.length > 0) {
      return snippet;
    }
  }
  
  // Check if snippet is public
  if (snippet.visibility === 'public') {
    return snippet;
  }

  return null;
}

export async function getSnippetsByUser(userId: number): Promise<Omit<Snippet, 'embedding'>[]> {
  return await db.select(snippetSelection).from(snippets).where(eq(snippets.userId, userId));
}

export async function getSnippetsByTeam(teamId: number): Promise<Omit<Snippet, 'embedding'>[]> {
  return await db
    .select(snippetSelection) // Use selection set
    .from(snippets)
    .where(and(eq(snippets.teamId, teamId), eq(snippets.visibility, 'team')));
}

export async function getPublicSnippets(): Promise<Omit<Snippet, 'embedding'>[]> {
  return await db.select(snippetSelection).from(snippets).where(eq(snippets.visibility, 'public'));
}

export async function updateSnippet(
  snippetId: number,
  data: Partial<NewSnippet>,
  userId: number
): Promise<Omit<Snippet, 'embedding'> | null> {
  const existingSnippets = await db // Fetch full snippet initially for embedding logic
    .select() 
    .from(snippets)
    .where(eq(snippets.id, snippetId))
    .limit(1);

  if (existingSnippets.length === 0) {
    return null;
  }

  const existingSnippet = existingSnippets[0];

  if (existingSnippet.userId !== userId) {
    return null; // User does not own the snippet
  }

  const updatedData = { ...existingSnippet, ...data, updatedAt: new Date() };

  // Check if relevant fields for embedding have changed
  const relevantFieldsChanged = 
    ('title' in data && data.title !== existingSnippet.title) ||
    ('description' in data && data.description !== existingSnippet.description) ||
    ('code' in data && data.code !== existingSnippet.code) ||
    ('language'in data && data.language !== existingSnippet.language) ||
    ('tags' in data && JSON.stringify(data.tags) !== JSON.stringify(existingSnippet.tags)); // Simple comparison for tags

  let embeddingJson: string | undefined | null = existingSnippet.embedding; // Keep existing if no change

  if (relevantFieldsChanged) {
    console.log('Relevant fields changed, regenerating embedding for snippet ID:', snippetId);
    const textForEmbedding = snippetToTextForEmbedding(updatedData);
    try {
      const embeddingVector = await generateEmbedding(textForEmbedding);
      embeddingJson = JSON.stringify(embeddingVector);
    } catch (error) {
      console.error('Failed to regenerate embedding for snippet ID:', snippetId, error);
      // Decide how to handle: proceed with old embedding, set to null, or error out
      // For now, we'll keep the old embedding if regeneration fails
      embeddingJson = existingSnippet.embedding; 
    }
  }

  const updatedResult = await db
    .update(snippets)
    .set({ ...data, embedding: embeddingJson, updatedAt: new Date() })
    .where(eq(snippets.id, snippetId))
    .returning(snippetSelection); // Use selection set

  return updatedResult[0];
}

export async function deleteSnippet(
  snippetId: number,
  userId: number
): Promise<{ success: boolean }> {
  const result = await db
    .select()
    .from(snippets)
    .where(eq(snippets.id, snippetId))
    .limit(1);

  if (result.length === 0) {
    return { success: false }; // Snippet not found
  }

  const snippet = result[0];

  if (snippet.userId !== userId) {
    return { success: false }; // User does not own the snippet
  }

  await db.delete(snippets).where(eq(snippets.id, snippetId));
  return { success: true };
}

// Cosine Similarity Function (can be moved to a math utils file if preferred)
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function searchSnippetsByEmbedding(
  queryVector: number[],
  userId: number, // For access control
  teamId?: number | null, // User's team ID for team-specific snippets
  limit: number = 10
): Promise<Omit<Snippet, 'embedding'>[]> { // Return type updated

  // 1. Fetch all snippets potentially accessible to the user, including embeddings for calculation
  let accessibleSnippetsQuery = db
    .select() // Select all fields initially, including embedding
    .from(snippets)
    .where(
      or(
        eq(snippets.userId, userId), // User's own snippets
        eq(snippets.visibility, 'public'), // Public snippets
        // If user has a team, include team-visible snippets from their team
        teamId ? and(eq(snippets.teamId, teamId), eq(snippets.visibility, 'team')) : undefined
      )
    );
  
  const allPotentiallyAccessibleSnippets = await accessibleSnippetsQuery;

  // 2. Filter out snippets without embeddings and calculate similarity
  const snippetsWithSimilarity = allPotentiallyAccessibleSnippets
    .map((snippetWithFullData) => { // Renamed for clarity
      if (!snippetWithFullData.embedding) {
        return null; // Skip snippets without embeddings
      }
      try {
        const snippetVector = JSON.parse(snippetWithFullData.embedding) as number[];
        if (!Array.isArray(snippetVector) || snippetVector.some(isNaN)) {
            console.warn(`Skipping snippet ID ${snippetWithFullData.id} due to invalid stored embedding.`);
            return null;
        }
        const similarity = cosineSimilarity(queryVector, snippetVector);
        // Construct the object to return, excluding the embedding
        const { embedding, ...snippetWithoutEmbedding } = snippetWithFullData;
        return { ...snippetWithoutEmbedding, similarity };
      } catch (error) {
        console.error(`Error parsing embedding for snippet ID ${snippetWithFullData.id}:`, error);
        return null; // Skip on error
      }
    })
    .filter(Boolean) as (Omit<Snippet, 'embedding'> & { similarity: number })[];

  // 3. Sort by similarity (descending) and take top N
  snippetsWithSimilarity.sort((a, b) => b.similarity - a.similarity);

  return snippetsWithSimilarity.slice(0, limit).map(s => {
    const { similarity, ...snippetFields } = s; // Remove similarity before returning
    return snippetFields as Omit<Snippet, 'embedding'>;
  });
}
