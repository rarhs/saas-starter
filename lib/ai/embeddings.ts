import { pipeline, Pipeline } from '@xenova/transformers';

// Use a singleton pattern to ensure the pipeline is loaded only once.
class EmbeddingPipelineSingleton {
  private static instance: Promise<Pipeline> | null = null;
  private static model = 'Xenova/all-MiniLM-L6-v2'; // Efficient model

  static async getInstance(): Promise<Pipeline> {
    if (this.instance === null) {
      try {
        console.log('Initializing embedding pipeline...');
        // Specify 'feature-extraction' task
        this.instance = pipeline('feature-extraction', this.model, {
          quantized: true, // Use quantized model for smaller size and faster speed
        });
        await this.instance; // Wait for the pipeline to load
        console.log('Embedding pipeline initialized successfully.');
      } catch (error) {
        console.error('Failed to initialize embedding pipeline:', error);
        // Set instance to null so it can be retried or handled
        this.instance = null; 
        throw error; // Re-throw to indicate failure
      }
    }
    return this.instance as Promise<Pipeline>;
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const extractor = await EmbeddingPipelineSingleton.getInstance();
    if (!extractor) {
      throw new Error('Embedding pipeline not available.');
    }
    // Generate embeddings
    const output = await extractor(text, {
      pooling: 'mean', // Standard pooling strategy
      normalize: true, // Normalize embeddings for cosine similarity
    });

    // The output structure might vary based on the model.
    // For 'all-MiniLM-L6-v2', the embeddings are typically in output.data
    // Convert Float32Array to a regular number array
    return Array.from(output.data as Float32Array);
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Return an empty array or throw, depending on how you want to handle errors
    // For now, let's re-throw so the calling function is aware.
    throw error;
  }
}

// Example usage (optional, for testing)
/*
(async () => {
  try {
    const text1 = "This is a test sentence.";
    const embedding1 = await generateEmbedding(text1);
    console.log(`Embedding for "${text1}":`, embedding1.slice(0, 5)); // Print first 5 dimensions

    const text2 = "Another example sentence for testing.";
    const embedding2 = await generateEmbedding(text2);
    console.log(`Embedding for "${text2}":`, embedding2.slice(0, 5));
    
    // Simple cosine similarity function for testing
    function cosineSimilarity(vecA: number[], vecB: number[]): number {
        if (vecA.length !== vecB.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    console.log("Similarity:", cosineSimilarity(embedding1, embedding2));

  } catch (e) {
    console.error("Embedding test failed:", e);
  }
})();
*/
