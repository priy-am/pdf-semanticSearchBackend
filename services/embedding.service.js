import "dotenv/config";
import { Mistral } from "@mistralai/mistralai";

if (!process.env.MISTRAL_API_KEY) {
  throw new Error("MISTRAL_API_KEY is not set.");
}

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export const getEmbedding = async (text) => {
  try {
    const response = await client.embeddings.create({
      model: "mistral-embed",
      inputs: [text],
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding Error:", error);
    throw new Error("Failed to generate embedding.");
  }
};