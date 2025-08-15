import express from "express";

import auth from "../middleware/authMiddleware.js";
import { explainCode, generateImage, summarizeText, translateText } from "../controller/aiController.js";


const router = express.Router();

router.post("/summarize", auth, summarizeText);
router.post("/translate", auth, translateText);
router.post("/explain-code", auth, explainCode);
router.post("/generate-image", auth, generateImage);

export default router;
