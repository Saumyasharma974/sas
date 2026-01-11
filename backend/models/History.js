import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: [
                "Summarizer",
                "Translator",
                "Code Explainer",
                "Image Generator",
                "Debugger",
                "Article Writer",
                "Blog Titles",
                "Resume Review",
                "Chat PDF"
            ],
        },
        input: {
            type: mongoose.Schema.Types.Mixed, // Can be string or object
            required: true,
        },
        output: {
            type: mongoose.Schema.Types.Mixed, // Can be string, object, or array
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("History", historySchema);
