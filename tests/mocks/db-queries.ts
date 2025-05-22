// tests/mocks/db-queries.ts

// Mock implementations for functions in lib/db/queries.ts
export const getUser = jest.fn();
export const createSnippet = jest.fn();
export const getSnippetById = jest.fn();
export const getSnippetsByUser = jest.fn();
export const getSnippetsByTeam = jest.fn();
export const getPublicSnippets = jest.fn();
export const updateSnippet = jest.fn();
export const deleteSnippet = jest.fn();
export const getTeamForUser = jest.fn();
export const searchSnippetsByEmbedding = jest.fn();

// You might want to provide default mock implementations if needed, e.g.:
// getUser.mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com', teamId: 1 });
// createSnippet.mockImplementation(async (data) => ({ ...data, id: Date.now(), createdAt: new Date(), updatedAt: new Date() }));
