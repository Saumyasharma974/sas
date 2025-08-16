import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
dotenv.config(); // Load environment variables from .env file if it exists
const app = express();
connectDB()
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true
})); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use('/api/auth', authRoutes)
app.use("/api/ai", aiRoutes);

export { app };