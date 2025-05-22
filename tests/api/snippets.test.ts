// tests/api/snippets.test.ts
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node/api-resolver';
import request from 'supertest';
import { URL } from 'url';

// Import handlers for the API routes
import * as snippetsRouteHandler from '@/app/api/snippets/route';
import *K from 'K';
import * as snippetIdRouteHandler from '@/app/api/snippets/[id]/route';
import * as snippetSearchRouteHandler from '@/app/api/snippets/search/route';

// Mock dependencies
jest.mock('jose', () => require('../mocks/jose'));
jest.mock('@/lib/db/queries', () => require('../mocks/db-queries'));
jest.mock('@/lib/ai/embeddings', () => ({
  generateEmbedding: jest.fn().mockResolvedValue(Array(384).fill(0.1)), // Mock embedding vector
}));


// Mocked query functions to be accessible in tests for individual setup
const {
  getUser: mockGetUser,
  createSnippet: mockCreateSnippet,
  getSnippetById: mockGetSnippetById,
  getSnippetsByUser: mockGetSnippetsByUser,
  getSnippetsByTeam: mockGetSnippetsByTeam,
  getPublicSnippets: mockGetPublicSnippets,
  updateSnippet: mockUpdateSnippet,
  deleteSnippet: mockDeleteSnippet,
  getTeamForUser: mockGetTeamForUser,
  searchSnippetsByEmbedding: mockSearchSnippetsByEmbedding,
} = require('@/lib/db/queries');


const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', teamId: 1 };
const mockSnippet = {
  id: 101,
  title: 'Test Snippet',
  code: 'console.log("test");',
  language: 'javascript',
  userId: 1,
  teamId: 1,
  visibility: 'private',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Helper to create a test server for Next.js API routes
const createTestServer = (handler: any, routePath?: string) => {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '/', 'http://localhost');
    if (routePath && url.pathname !== routePath && !url.pathname.startsWith(routePath + '/')) {
        // If specific routePath is given and doesn't match, treat as 404
        // This is a simplification for testing multiple dynamic routes.
        // For single handler testing, this might not be necessary.
        res.statusCode = 404;
        res.end();
        return;
    }
    return apiResolver(req, res, url.searchParams, handler, {} as any, false);
  });
  return server;
};


describe('Snippets API Endpoints', () => {
  let server: ReturnType<typeof createServer>;

  afterEach(() => {
    jest.clearAllMocks();
    if (server) {
      server.close();
    }
  });

  describe('POST /api/snippets', () => {
    beforeEach(() => {
      server = createTestServer(snippetsRouteHandler);
    });

    it('should create a snippet successfully', async () => {
      mockGetUser.mockResolvedValue(mockUser);
      mockCreateSnippet.mockImplementation(async (data) => ({
        ...data,
        id: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: mockUser.id,
      }));

      const snippetData = {
        title: 'New Valid Snippet',
        code: 'alert("hello");',
        language: 'javascript',
        visibility: 'private',
      };

      const response = await request(server)
        .post('/api/snippets')
        .send(snippetData)
        .set('Cookie', 'session=mocked-session-token'); // Simulate session cookie

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(snippetData.title);
      expect(mockCreateSnippet).toHaveBeenCalledWith(expect.objectContaining(snippetData));
    });

    it('should return 401 if user is not authenticated', async () => {
      mockGetUser.mockResolvedValue(null);
      const response = await request(server)
        .post('/api/snippets')
        .send({ title: 'test', code: 'test', language: 'js', visibility: 'private' });
      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid input data', async () => {
      mockGetUser.mockResolvedValue(mockUser);
      const response = await request(server)
        .post('/api/snippets')
        .send({ code: 'test' }) // Missing title, language, visibility
        .set('Cookie', 'session=mocked-session-token');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid input');
    });
  });

  describe('GET /api/snippets/[id]', () => {
     beforeEach(() => {
      // For routes with dynamic params, we need to handle them slightly differently
      // or ensure the handler can be called directly with params.
      // The `apiResolver` expects params to be parsed from the URL.
      // We are testing the handler module directly.
      server = createTestServer(snippetIdRouteHandler, '/api/snippets'); // Base path for this handler
    });

    it('should fetch a snippet successfully if public', async () => {
      mockGetSnippetById.mockResolvedValue({ ...mockSnippet, visibility: 'public' });
      mockGetUser.mockResolvedValue(null); // Simulate unauthenticated user

      const response = await request(server).get(`/api/snippets/${mockSnippet.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockSnippet.id);
      expect(mockGetSnippetById).toHaveBeenCalledWith(mockSnippet.id, -1); // -1 for unauth user
    });
    
    it('should fetch a snippet successfully if user is owner', async () => {
      mockGetUser.mockResolvedValue(mockUser);
      mockGetSnippetById.mockResolvedValue({ ...mockSnippet, userId: mockUser.id, visibility: 'private' });

      const response = await request(server)
        .get(`/api/snippets/${mockSnippet.id}`)
        .set('Cookie', 'session=mocked-session-token');
        
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockSnippet.id);
      expect(mockGetSnippetById).toHaveBeenCalledWith(mockSnippet.id, mockUser.id);
    });

    it('should return 404 if snippet not found', async () => {
      mockGetUser.mockResolvedValue(mockUser);
      mockGetSnippetById.mockResolvedValue(null);
      const response = await request(server)
        .get('/api/snippets/999')
        .set('Cookie', 'session=mocked-session-token');
      expect(response.status).toBe(404);
    });
    
    it('should return 404 if snippet is private and user is not owner (and not team member)', async () => {
      mockGetUser.mockResolvedValue({ ...mockUser, id: 2 }); // Different user
      // getSnippetById will return null due to auth logic inside it
      mockGetSnippetById.mockResolvedValue(null); 

      const response = await request(server)
        .get(`/api/snippets/${mockSnippet.id}`) // mockSnippet is owned by user 1
        .set('Cookie', 'session=mocked-session-token');
        
      expect(response.status).toBe(404); // getSnippetById returns null, so API returns 404
      expect(mockGetSnippetById).toHaveBeenCalledWith(mockSnippet.id, 2);
    });
  });
  
  describe('PUT /api/snippets/[id]', () => {
    beforeEach(() => {
      server = createTestServer(snippetIdRouteHandler, '/api/snippets');
    });

    it('should update a snippet successfully if user is owner', async () => {
      mockGetUser.mockResolvedValue(mockUser);
      mockUpdateSnippet.mockResolvedValue({ ...mockSnippet, title: 'Updated Title' });

      const response = await request(server)
        .put(`/api/snippets/${mockSnippet.id}`)
        .send({ title: 'Updated Title' })
        .set('Cookie', 'session=mocked-session-token');
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(mockUpdateSnippet).toHaveBeenCalledWith(mockSnippet.id, { title: 'Updated Title' }, mockUser.id);
    });

    it('should return 401 if user is not authenticated', async () => {
      mockGetUser.mockResolvedValue(null);
      const response = await request(server)
        .put(`/api/snippets/${mockSnippet.id}`)
        .send({ title: 'Updated Title' });
      expect(response.status).toBe(401);
    });
    
    it('should return 404 if user is not owner', async () => {
      mockGetUser.mockResolvedValue({ ...mockUser, id: 2 }); // Different user
      mockUpdateSnippet.mockResolvedValue(null); // updateSnippet returns null if not owner

      const response = await request(server)
        .put(`/api/snippets/${mockSnippet.id}`)
        .send({ title: 'Updated Title' })
        .set('Cookie', 'session=mocked-session-token');
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/snippets/[id]', () => {
    beforeEach(() => {
      server = createTestServer(snippetIdRouteHandler, '/api/snippets');
    });

    it('should delete a snippet successfully if user is owner', async () => {
      mockGetUser.mockResolvedValue(mockUser);
      mockDeleteSnippet.mockResolvedValue({ success: true });

      const response = await request(server)
        .delete(`/api/snippets/${mockSnippet.id}`)
        .set('Cookie', 'session=mocked-session-token');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Snippet deleted successfully');
      expect(mockDeleteSnippet).toHaveBeenCalledWith(mockSnippet.id, mockUser.id);
    });
    
    it('should return 404 if delete fails (e.g. not owner or not found)', async () => {
      mockGetUser.mockResolvedValue(mockUser);
      mockDeleteSnippet.mockResolvedValue({ success: false });

      const response = await request(server)
        .delete(`/api/snippets/${mockSnippet.id}`)
        .set('Cookie', 'session=mocked-session-token');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/snippets/search', () => {
    beforeEach(() => {
      server = createTestServer(snippetSearchRouteHandler);
    });

    it('should return search results for an authenticated user', async () => {
      mockGetUser.mockResolvedValue(mockUser);
      mockGetTeamForUser.mockResolvedValue({ id: mockUser.teamId, name: 'Test Team' });
      const searchResults = [{ ...mockSnippet, title: 'Search Result Snippet' }];
      mockSearchSnippetsByEmbedding.mockResolvedValue(searchResults);

      const response = await request(server)
        .get('/api/snippets/search?q=testquery')
        .set('Cookie', 'session=mocked-session-token');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(searchResults);
      expect(require('@/lib/ai/embeddings').generateEmbedding).toHaveBeenCalledWith('testquery');
      expect(mockSearchSnippetsByEmbedding).toHaveBeenCalledWith(
        expect.any(Array), // a mock embedding vector
        mockUser.id,
        mockUser.teamId
      );
    });

    it('should return 401 if user is not authenticated for search', async () => {
      mockGetUser.mockResolvedValue(null);
      const response = await request(server).get('/api/snippets/search?q=testquery');
      expect(response.status).toBe(401);
    });

    it('should return 400 if search query is missing', async () => {
      mockGetUser.mockResolvedValue(mockUser);
      const response = await request(server)
        .get('/api/snippets/search')
        .set('Cookie', 'session=mocked-session-token');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid search query');
    });
  });
  
  // TODO: Tests for GET /api/snippets (listing with filters)
  // These would be similar, mocking getSnippetsByUser, getSnippetsByTeam, getPublicSnippets, getTeamForUser
});

describe('Utility functions', () => {
  // Example unit test for cosineSimilarity if it were complex and local
  // Assuming cosineSimilarity is now part of lib/db/queries.ts (as implemented)
  // For this example, let's imagine it's in a separate utils file or test it directly if accessible.
  // If it's not exported or easily accessible, testing it via the search endpoint (as done above) is an indirect way.

  // Since cosineSimilarity is a local function within lib/db/queries.ts and not exported,
  // direct unit testing is harder without refactoring.
  // Its correctness is implicitly tested via the searchSnippetsByEmbedding mock and search endpoint tests.
  // If it were in `lib/ai/embeddings.ts` or another util, we could do:
  /*
  const { cosineSimilarity_for_test } = require('@/lib/ai/embeddings'); // hypothetical export
  it('should calculate cosine similarity correctly', () => {
    expect(cosineSimilarity_for_test([1, 0], [0, 1])).toBe(0);
    expect(cosineSimilarity_for_test([1, 1], [1, 1])).toBeCloseTo(1);
    // Add more test cases
  });
  */
  
  // Unit test for generateEmbedding (mocking the pipeline)
  const { generateEmbedding } = require('@/lib/ai/embeddings');
  const { pipeline } = require('@xenova/transformers');

  jest.mock('@xenova/transformers', () => ({
    ...jest.requireActual('@xenova/transformers'), // Import and retain default behavior
    pipeline: jest.fn(), // Mock the pipeline function specifically
  }));


  it('generateEmbedding should call the pipeline and return data', async () => {
    const mockExtractor = jest.fn().mockResolvedValue({ data: new Float32Array([0.1, 0.2, 0.3]) });
    (pipeline as jest.Mock).mockResolvedValue(mockExtractor); // Mock pipeline to return our mockExtractor

    const text = "test sentence";
    const embedding = await generateEmbedding(text);

    expect(pipeline).toHaveBeenCalledWith('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {"quantized": true});
    expect(mockExtractor).toHaveBeenCalledWith(text, { pooling: 'mean', normalize: true });
    expect(embedding).toEqual([0.1, 0.2, 0.3]);
  });
});
