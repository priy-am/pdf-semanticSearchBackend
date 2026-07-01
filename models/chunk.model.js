import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  pdfId: String,
  fileName: String,
  text: String,
  embedding: [Number],
});

export default mongoose.model("Chunk", chunkSchema);
