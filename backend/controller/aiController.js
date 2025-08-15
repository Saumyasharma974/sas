import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fetch from "node-fetch";
import FormData from "form-data";

dotenv.config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const callGemini = async (model, prompt) => {
  const { data } = await axios.post(
    `${GEMINI_URL}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

// 1. Summarizer
export const summarizeText = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) throw new ApiError(400, "Text is required");
  const result = await callGemini(
    "gemini-2.0-flash",
    `Summarize the following text in a concise paragraph:\n\n${text}`
  );
  res.status(200).json(new ApiResponse(200, { summary: result }, "Summary generated"));
});

// 2. Translator
export const translateText = asyncHandler(async (req, res) => {
  const { text, language } = req.body;
  if (!text || !language) throw new ApiError(400, "Text and language are required");
  const result = await callGemini(
    "gemini-2.0-flash",
    `Translate the following text to ${language}:\n\n${text}`
  );
  res.status(200).json(new ApiResponse(200, { translation: result }, "Translation generated"));
});

// 3. Code Explainer
export const explainCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new ApiError(400, "Code is required");
  const result = await callGemini(
    "gemini-2.0-flash",
    `Explain what the following code does:\n\n${code}`
  );
  res.status(200).json(new ApiResponse(200, { explanation: result }, "Code explained"));
});

// 4. Image Generator
export const generateImage = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) throw new ApiError(400, "Prompt is required");

  try {
    // Step 1: Send prompt to Clipdrop
    const formData = new FormData();
    formData.append("prompt", prompt);

    const clipdropResponse = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: { "x-api-key": process.env.API_KEY_CLIPDROP },
      body: formData,
    });

    if (!clipdropResponse.ok) {
      throw new ApiError(clipdropResponse.status, "Failed to generate image from Clipdrop");
    }

    // Step 2: Convert buffer to Base64 for upload
    const buffer = await clipdropResponse.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Step 3: Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      { folder: "sas_ai_images" } // Optional folder
    );

    // Step 4: Send URL to frontend
    res
      .status(200)
      .json(new ApiResponse(200, { imageUrl: uploadResponse.secure_url }, "Image generated successfully"));
  } catch (error) {
    console.error("Image Generation Error:", error.message);
    throw new ApiError(500, "Error generating image");
  }
});