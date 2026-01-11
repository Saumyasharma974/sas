import React, { useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Button } from "../componets/ui";
import axios from "axios";
import { UploadCloud } from "lucide-react";

import { toast } from "react-toastify";

export default function ResumeReview() {
    const [file, setFile] = useState(null);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleReview = async () => {
        if (!file) {
            toast.warn("Please select a file");
            return;
        }

        setLoading(true);
        setReview("");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const { data } = await axios.post(
                "http://localhost:3000/api/ai/resume-review",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true,
                }
            );
            setReview(data.data.review);
            toast.success("Resume reviewed!");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                const msg = error.response.data.message || "";
                if (msg.includes("Premium")) toast.error("💎 Premium Feature! Please upgrade.");
                else toast.error("⚠️ Insufficient Credits!");
            } else {
                toast.error("Failed to review resume");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold text-white mb-4">AI Resume Review</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Resume (PDF)</label>
                            <div className="border-2 border-dashed border-neutral-700 bg-neutral-900/30 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                                    <UploadCloud className="w-10 h-10 text-indigo-500 mb-3" />
                                    <span className="text-sm font-medium text-white">
                                        {file ? file.name : "Click to Upload PDF"}
                                    </span>
                                    {!file && <span className="text-xs text-gray-500 mt-1">Supports PDF only</span>}
                                </label>
                            </div>
                        </div>

                        <Button
                            onClick={handleReview}
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            disabled={loading || !file}
                        >
                            {loading ? "Analyzing Resume..." : "Review Resume"}
                        </Button>
                    </Card>
                </div>

                <div>
                    <Card className="h-full min-h-[400px]">
                        <h2 className="text-lg font-semibold text-teal-400 mb-4">Analysis Results</h2>
                        <div className="p-4 bg-neutral-900/50 rounded-lg h-[calc(100%-3rem)] overflow-y-auto text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {review ? (
                                review
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <p className="text-gray-500 italic">
                                        Upload your resume and click review to see the analysis here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
