import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Generate a 1536-dimension embedding vector using OpenAI text-embedding-3-small.
 *
 * @param text - The text to embed (profile summary, job description, etc.)
 * @returns A 1536-dimension float array
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text.trim()) {
    throw new Error("Cannot generate embedding for empty text");
  }

  const openai = getOpenAI();

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 1536,
  });

  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts in a single API call.
 * More efficient than calling generateEmbedding() in a loop.
 *
 * @param texts - Array of texts to embed
 * @returns Array of 1536-dimension float arrays (same order as input)
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const nonEmpty = texts.map((t) => t.trim()).filter((t) => t.length > 0);
  if (nonEmpty.length !== texts.length) {
    throw new Error("All texts must be non-empty");
  }

  const openai = getOpenAI();

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
    dimensions: 1536,
  });

  // Sort by index to maintain input order
  const sorted = response.data.sort((a, b) => a.index - b.index);
  return sorted.map((d) => d.embedding);
}

/**
 * Compute cosine similarity between two embedding vectors.
 * Returns a value between -1 and 1 (1 = identical, 0 = orthogonal).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(
      `Vector dimension mismatch: ${a.length} vs ${b.length}`
    );
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}
