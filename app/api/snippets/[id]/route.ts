import { NextResponse } from 'next/server';
import {
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  getUser,
} from '@/lib/db/queries';
import { NewSnippet } from '@/lib/db/schema';
import { updateSnippetSchema } from '@/lib/validators/snippet-validators';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) {
    // Allow fetching public snippets without authentication
    // For private/team snippets, user must be authenticated.
  }

  const snippetId = parseInt(params.id, 10);
  if (isNaN(snippetId)) {
    return NextResponse.json({ error: 'Invalid snippet ID' }, { status: 400 });
  }

  try {
    // If user is not logged in, getSnippetById should only return public snippets.
    // If user is logged in, it handles auth internally.
    const snippet = await getSnippetById(snippetId, user ? user.id : -1); // Pass -1 or similar for non-logged-in users

    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }
    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Error fetching snippet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippet' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const snippetId = parseInt(params.id, 10);
  if (isNaN(snippetId)) {
    return NextResponse.json({ error: 'Invalid snippet ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validationResult = updateSnippetSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }
    
    const { title, code, language, description, tags, visibility } = validationResult.data;

    if (Object.keys(validationResult.data).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const updateData: Partial<NewSnippet> = {};
    if (title !== undefined) updateData.title = title;
    if (code !== undefined) updateData.code = code;
    if (language !== undefined) updateData.language = language;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags || []; // Ensure empty array if null
    if (visibility !== undefined) updateData.visibility = visibility;
    
    // If visibility is changing to 'team', the form should have already handled teamId association logic.
    // If visibility changes away from 'team', the teamId should ideally be nulled by the updateSnippet query if not handled here.
    // The `updateSnippet` query itself should also ensure that if `visibility` is not 'team', `teamId` is set to null.
    // This is a good place for an additional check or to pass teamId explicitly if needed for such logic.
    // For now, `updateSnippet` handles embedding regeneration based on changed fields.

    const updatedSnippet = await updateSnippet(snippetId, updateData, user.id);

    if (!updatedSnippet) {
      return NextResponse.json(
        { error: 'Snippet not found or update failed (e.g. not owner)' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedSnippet);
  } catch (error: any) {
    console.error('Error updating snippet:', error);
     if (error.name === 'ZodError') { // Should be caught by safeParse
        return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update snippet' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const snippetId = parseInt(params.id, 10);
  if (isNaN(snippetId)) {
    return NextResponse.json({ error: 'Invalid snippet ID' }, { status: 400 });
  }

  try {
    const result = await deleteSnippet(snippetId, user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Snippet not found or delete failed' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    return NextResponse.json(
      { error: 'Failed to delete snippet' },
      { status: 500 }
    );
  }
}
