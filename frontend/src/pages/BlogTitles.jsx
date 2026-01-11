import React, { useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Input, Button, Select } from "../componets/ui";
import axios from "axios";

const categories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
];

import { toast } from "react-toastify";

export default function BlogTitles() {
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("General");
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!keyword.trim()) {
            toast.warn("Please enter a keyword");
            return;
        }

        setLoading(true);
        setTitles([]);
        try {
            const { data } = await axios.post(
                "http://localhost:3000/api/ai/blog-titles",
                { keyword, category },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    withCredentials: true,
                }
            );
            setTitles(data.data.titles);
            toast.success("Titles generated!");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                const msg = error.response.data.message || "";
                if (msg.includes("Premium")) toast.error("💎 Premium Feature! Please upgrade.");
                else toast.error("⚠️ Insufficient Credits!");
            } else {
                toast.error("Failed to generate titles");
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Optional: Toast notification could go here
    };

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold text-white mb-4">AI Blog Title Generator</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: Input */}
                <div className="space-y-6">
                    <Card className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Keyword / Topic</label>
                            <Input
                                placeholder="e.g. Artificial Intelligence"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${category === cat
                                            ? "bg-purple-600 border-purple-600 text-white"
                                            : "bg-transparent border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
                            disabled={loading}
                        >
                            {loading ? "Generating Ideas..." : "Generate Titles"}
                        </Button>
                    </Card>
                </div>

                {/* Right Side: Results */}
                <div>
                    <Card className="h-full min-h-[400px]">
                        <h2 className="text-lg font-semibold text-purple-400 mb-4">Generated Titles</h2>

                        {titles.length > 0 ? (
                            <div className="space-y-3">
                                {titles.map((title, index) => (
                                    <div
                                        key={index}
                                        className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800 flex justify-between items-center group hover:border-purple-500/30 transition-colors"
                                    >
                                        <span className="text-gray-300">{title}</span>
                                        <button
                                            onClick={() => copyToClipboard(title)}
                                            className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            title="Copy"
                                        >
                                            Use
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                <span className="text-4xl mb-4 opacity-20 text-gray-500">#</span>
                                <p className="text-gray-500 italic">
                                    Enter a topic and click "Generate Titles" to get started
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
