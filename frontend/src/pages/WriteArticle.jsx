import React, { useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Input, Button, Select } from "../componets/ui";
import axios from "axios";

import { toast } from "react-toastify";

export default function WriteArticle() {
    const [topic, setTopic] = useState("");
    const [length, setLength] = useState("Short (500-800 word)");
    const [article, setArticle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.warn("Please enter a topic");
            return;
        }

        setLoading(true);
        setArticle("");
        try {
            const { data } = await axios.post(
                "http://localhost:3000/api/ai/write-article",
                { topic, length },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    withCredentials: true,
                }
            );
            setArticle(data.data.article);
            toast.success("Article generated!");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                toast.error("⚠️ Insufficient Credits!");
            } else {
                toast.error("Failed to generate article");
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(article);
        alert("Article copied to clipboard!");
    };

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold text-white mb-4">AI Article Writer</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Article Topic</label>
                            <Input
                                placeholder="e.g. The Future of AI in Healthcare"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Article Length</label>
                            <Select
                                value={length}
                                onChange={setLength}
                                options={[
                                    { value: "Short (500-800 word)", label: "Short (500-800 words)" },
                                    { value: "Medium (800-1200 word)", label: "Medium (800-1200 words)" },
                                    { value: "Long (1200+ word)", label: "Long (1200+ words)" },
                                ]}
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Generating..." : "Generate Article"}
                        </Button>
                    </Card>
                </div>

                <div>
                    <Card className="h-full min-h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">Generated Article</h2>
                            {article && (
                                <Button variant="ghost" onClick={copyToClipboard} size="sm">
                                    Copy
                                </Button>
                            )}
                        </div>

                        <div className="flex-1 p-4 bg-neutral-900/50 rounded-lg overflow-y-auto max-h-[600px] text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {article || (
                                <div className="text-gray-500 italic text-center mt-20">
                                    Enter a topic and generate your article to see it here.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
