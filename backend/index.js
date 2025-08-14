import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config(); // Load environment variables from .env file if it exists
const app = express();
connectDB()
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.get("/", (req, res) => {
  res.send("Hello, World!");
});


export { app };