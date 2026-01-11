import express from "express";

import auth from "../middleware/authMiddleware.js";
import { debugCode, explainCode, generateImage, summarizeText, translateText, writeArticle, generateBlogTitles, reviewResume, extractTextFromPDF, chatWithPDF } from "../controller/aiController.js";
import { checkCredits } from "../middleware/checkCredit.js";
import { restrictToPremium } from "../middleware/premiumMiddleware.js";
import { createCheckoutSession, verifyPayment } from "../controller/stripeController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Free Tier Features (Just check credits/limit usage)
router.post("/summarize", auth, checkCredits, summarizeText);
router.post("/write-article", auth, checkCredits, writeArticle);

// Premium Features (Require Premium Subscription)
router.post("/translate", auth, restrictToPremium, translateText);
router.post("/explain-code", auth, restrictToPremium, explainCode);
router.post("/generate-image", auth, restrictToPremium, generateImage);
router.post("/debug-code", auth, restrictToPremium, debugCode);
router.post("/blog-titles", auth, restrictToPremium, generateBlogTitles);
router.post("/resume-review", auth, restrictToPremium, upload.single("resume"), reviewResume);
router.post("/extract-text", auth, restrictToPremium, upload.single("pdf"), extractTextFromPDF);
router.post("/chat-pdf", auth, restrictToPremium, chatWithPDF);

// Payments
router.post("/create-checkout-session", auth, createCheckoutSession);
router.post("/verify-payment", auth, verifyPayment);


export default router;
