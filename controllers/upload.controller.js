import { getEmbedding } from "../services/embedding.service.js";
import { extractPDFText } from "../services/pdf.service.js";
import { chunkText } from "../utlis/chunkText.js";
import chunkModel from "../models/chunk.model.js";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF",
      });
    }

    const file = req.file;

    const extractedText = await extractPDFText(file.path);

    const chunks = chunkText(extractedText);

    const pdfId = file.filename;
    for (const text of chunks) {
      const embedding = await getEmbedding(text);
      await chunkModel.create({
        pdfId,
        fileName: file.originalname,
        text,
        embedding,
      });
    }

    res.json({ success: true, pdfId, chunksStored: chunks.length });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
