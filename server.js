import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes  from "./routes/upload.routes.js";
import searchRoutes from "./routes/search.route.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();


const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend of PDF-semantic search is Running Successfully",
  });
});

app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});