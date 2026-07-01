import ChunkModel from "../models/chunk.model.js";
import { getEmbedding } from "../services/embedding.service.js";

export async function search(req, res) {
    try {
        const { query, pdfId } = req.body;

        if (!query) {
            return res.status(400).json({ error: "Query is required." });
        }

        if (!pdfId) {
            return res.status(400).json({ error: "pdfId is required." });
        }

        const storedChunks = await ChunkModel.countDocuments({ pdfId });

        if (!storedChunks) {
            return res.status(404).json({
                error: "No chunks were found for this pdfId.",
                pdfId,
            });
        }

        const queryEmbedding = await getEmbedding(query);

        const results = await ChunkModel.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: 5,
                    filter: { pdfId },
                },
            },
            {
                $project: {
                    text: 1,
                    fileName: 1,
                    pdfId: 1,
                    score: { $meta: "vectorSearchScore" },
                },
            },
        ]);

        if (!results.length) {
            return res.status(404).json({
                error: "No matching chunks were found for this query and pdfId.",
                pdfId,
            });
        }

        res.json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}