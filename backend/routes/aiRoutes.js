import express from "express";

import auth from "../middleware/authMiddleware.js";
import { debugCode, explainCode, generateImage, summarizeText, translateText } from "../controller/aiController.js";
import { checkCredits } from "../middleware/checkCredit.js";
import { purchaseCredits } from "../controller/purchaseCreditController.js";


const router = express.Router();

router.post("/summarize",auth,checkCredits, summarizeText);
router.post("/translate", auth, checkCredits, translateText);
router.post("/explain-code", auth, checkCredits, explainCode);
router.post("/generate-image", auth, checkCredits, generateImage);
router.post("/debug-code", auth, checkCredits, debugCode);

router.post("/purchase", auth, purchaseCredits);


export default router;
