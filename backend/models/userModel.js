import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
      credits: {
    type: Number,
    default: 0, // New users start with 0 credits
  }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
