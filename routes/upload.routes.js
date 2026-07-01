import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadPDF } from "../controllers/upload.controller.js";

const uploadRouter = express.Router();

uploadRouter.post("/", upload.single("pdf"), uploadPDF);

export default uploadRouter;