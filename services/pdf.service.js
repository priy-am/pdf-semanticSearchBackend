import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export const extractPDFText = async (filePath) => {
  const pdfBuffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: pdfBuffer });

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
};
