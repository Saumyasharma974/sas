import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fetch from "node-fetch";
import FormData from "form-data";
import { deductCredit } from "../utils/deductedCredit.js";
import fs from "fs";
import { createRequire } from "module";
import History from "../models/History.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

dotenv.config();

/* -------------------- Cloudinary Config -------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* -------------------- Gemini Config -------------------- */
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

const GEMINI_MODEL = "gemini-2.5-flash"; // SAFE MODEL

/* -------------------- Utils -------------------- */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* -------------------- Gemini Call (WITH PROTECTION) -------------------- */
const callGemini = async (model, prompt, retries = 3) => {
  try {
    const { data } = await axios.post(
      `${GEMINI_URL}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.log("⚠️ Gemini rate limit hit. Retrying...");
      await sleep(3000); // wait 3 seconds
      return callGemini(model, prompt, retries - 1);
    }

    console.error(
      "❌ Gemini Error:",
      error.response?.data || error.message
    );

    throw new ApiError(
      429,
      "AI service is busy. Please try again after some time."
    );
  }
};

/* ============================================================
   1️⃣ TEXT SUMMARIZER
============================================================ */
export const summarizeText = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) throw new ApiError(400, "Text is required");

  const summary = await callGemini(
    GEMINI_MODEL,
    `Summarize the following text in a concise paragraph:\n\n${text}`
  );

  await deductCredit(req.user._id, 20);

  await History.create({
    user: req.user._id,
    type: "Summarizer",
    input: text,
    output: summary
  });

  res.status(200).json(
    new ApiResponse(200, { summary }, "Summary generated successfully")
  );
});

/* ============================================================
   2️⃣ TRANSLATOR
============================================================ */
export const translateText = asyncHandler(async (req, res) => {
  const { text, language } = req.body;
  if (!text || !language) {
    throw new ApiError(400, "Text and language are required");
  }

  const translation = await callGemini(
    GEMINI_MODEL,
    `Translate the following text to ${language}:\n\n${text}`
  );

  await deductCredit(req.user._id, 20);

  await History.create({
    user: req.user._id,
    type: "Translator",
    input: `To ${language}: ${text}`,
    output: translation
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { translation },
      "Translation generated successfully"
    )
  );
});

/* ============================================================
   3️⃣ CODE EXPLAINER
============================================================ */
export const explainCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new ApiError(400, "Code is required");

  const explanation = await callGemini(
    GEMINI_MODEL,
    `Explain what the following code does:\n\n${code}`
  );

  await deductCredit(req.user._id, 20);

  await History.create({
    user: req.user._id,
    type: "Code Explainer",
    input: code,
    output: explanation
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { explanation },
      "Code explained successfully"
    )
  );
});

/* ============================================================
   4️⃣ CODE DEBUGGER
============================================================ */
export const debugCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new ApiError(400, "Code is required");

  const result = await callGemini(
    GEMINI_MODEL,
    `Analyze the following code:

${code}

1. List the bugs or issues found (in detail).
2. Provide a corrected version of the code.`
  );

  const [bugs, correctedCode] =
    result.split("2.").map(part => part.trim());

  await deductCredit(req.user._id, 20);

  await History.create({
    user: req.user._id,
    type: "Debugger",
    input: code,
    output: {
      bugs: bugs || "No bugs found",
      correctedCode: correctedCode || "No corrected code provided"
    }
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        bugsFound: bugs || "No bugs found",
        correctedCode: correctedCode || "No corrected code provided"
      },
      "Code analyzed successfully"
    )
  );
});

/* ============================================================
   5️⃣ IMAGE GENERATOR (CLIPDROP)
============================================================ */
export const generateImage = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) throw new ApiError(400, "Prompt is required");

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);

    const clipdropResponse = await fetch(
      "https://clipdrop-api.co/text-to-image/v1",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.API_KEY_CLIPDROP
        },
        body: formData
      }
    );

    if (!clipdropResponse.ok) {
      throw new ApiError(
        clipdropResponse.status,
        "Failed to generate image"
      );
    }

    const buffer = await clipdropResponse.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      { folder: "sas_ai_images" }
    );

    await deductCredit(req.user._id, 20);

    await History.create({
      user: req.user._id,
      type: "Image Generator",
      input: prompt,
      output: uploadResponse.secure_url
    });

    res.status(200).json(
      new ApiResponse(
        200,
        { imageUrl: uploadResponse.secure_url },
        "Image generated successfully"
      )
    );
  } catch (error) {
    console.error("❌ Image Generation Error:", error.message);
    throw new ApiError(500, "Error generating image");
  }
});

/* ============================================================
   6️⃣ WRITE ARTICLE
============================================================ */
export const writeArticle = asyncHandler(async (req, res) => {
  const { topic, length } = req.body;
  if (!topic || !length) throw new ApiError(400, "Topic and length are required");

  let lengthPrompt = "";
  if (length === "Short (500-800 word)") lengthPrompt = "around 500-800 words";
  else if (length === "Medium (800-1200 word)") lengthPrompt = "around 800-1200 words";
  else if (length === "Long (1200+ word)") lengthPrompt = "at least 1200 words";
  else lengthPrompt = "concise";

  const article = await callGemini(
    GEMINI_MODEL,
    `Write a ${lengthPrompt} article about "${topic}". Use proper headings, paragraphs, and formatting.`
  );

  await deductCredit(req.user._id, 20); // Standard cost

  console.log("Saving history for user:", req.user._id);
  try {
    const historyEntry = await History.create({
      user: req.user._id,
      type: "Article Writer",
      input: `${topic} (${length})`,
      output: article
    });
    console.log("History saved:", historyEntry._id);
  } catch (histError) {
    console.error("History Save Error:", histError);
  }

  res.status(200).json(
    new ApiResponse(200, { article }, "Article generated successfully")
  );
});

/* ============================================================
   7️⃣ BLOG TITLES
============================================================ */
export const generateBlogTitles = asyncHandler(async (req, res) => {
  const { keyword, category } = req.body;
  if (!keyword || !category) throw new ApiError(400, "Keyword and category are required");

  const titlesResponse = await callGemini(
    GEMINI_MODEL,
    `Generate 10 catchy blog post titles about "${keyword}" for the category "${category}". List them one by one.`
  );

  // Simple splitting by newline to make it an array if needed, or just send text
  const titles = titlesResponse.split("\n").filter(t => t.trim().length > 0);

  await deductCredit(req.user._id, 20);

  await History.create({
    user: req.user._id,
    type: "Blog Titles",
    input: `${keyword} (${category})`,
    output: titles
  });

  res.status(200).json(
    new ApiResponse(200, { titles }, "Blog titles generated successfully")
  );
});

/* ============================================================
   8️⃣ RESUME REVIEW
============================================================ */
export const reviewResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Resume PDF file is required");

  const dataBuffer = fs.readFileSync(req.file.path);

  try {
    const data = await pdf(dataBuffer);
    const resumeText = data.text;

    const review = await callGemini(
      GEMINI_MODEL,
      `Analyze the following resume and provide a detailed critique.
       include:
       - Overall Impression
       - Strengths
       - Weaknesses
       - Specific suggestions for improvement

       Resume Content:
       ${resumeText}`
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    await deductCredit(req.user._id, 20); // Premium feature

    await History.create({
      user: req.user._id,
      type: "Resume Review",
      input: "Uploaded Resume PDF",
      output: review
    });

    res.status(200).json(
      new ApiResponse(200, { review }, "Resume reviewed successfully")
    );
  } catch (error) {
    // Attempt to clean up even on error
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("❌ PDF Parse Error:", error);
    throw new ApiError(500, "Failed to parse or analyze resume pdf");
  }
});

/* ============================================================
   9️⃣ EXTRACT TEXT FROM PDF
============================================================ */
export const extractTextFromPDF = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "PDF file is required");

  const dataBuffer = fs.readFileSync(req.file.path);

  try {
    const data = await pdf(dataBuffer);
    const text = data.text;

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // No credit deduction for just uploading/extracting? Or maybe small?
    // Let's keep it free or very cheap as it's a precursor to chat
    // await deductCredit(req.user._id, 1); 

    res.status(200).json(
      new ApiResponse(200, { text }, "Text extracted successfully")
    );
  } catch (error) {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("❌ PDF Parse Error:", error);
    throw new ApiError(500, "Failed to extract text from PDF");
  }
});

/* ============================================================
   🔟 CHAT WITH PDF
============================================================ */
export const chatWithPDF = asyncHandler(async (req, res) => {
  const { context, message, history = [] } = req.body;
  if (!context || !message) throw new ApiError(400, "Context and message are required");

  // Construct prompt with context
  // We can include a bit of history if needed, or rely on frontend to send full transcript
  // For simplicity, let's just use the current message + context + last few messages if provided

  const historyText = history.map(h => `${h.role}: ${h.content}`).join("\n");

  const prompt = `
  You are an AI assistant. Use the following CONTEXT from a PDF document to answer the user's question. 
  If the answer is not in the context, say "I couldn't find that information in the document."

  CONTEXT:
  ${context.substring(0, 30000)} ... (truncated if too long)

  CHAT HISTORY:
  ${historyText}

  USER: ${message}
  AI:
  `;

  const reply = await callGemini(GEMINI_MODEL, prompt);

  await deductCredit(req.user._id, 20);

  await History.create({
    user: req.user._id,
    type: "Chat PDF",
    input: message,
    output: reply
  });

  res.status(200).json(
    new ApiResponse(200, { reply }, "Response generated successfully")
  );
});
