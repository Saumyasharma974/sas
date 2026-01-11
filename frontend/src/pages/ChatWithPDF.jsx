import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Input, Button } from "../componets/ui";
import axios from "axios";
import { UploadCloud, Send, FileText, Trash2 } from "lucide-react";

import { toast } from "react-toastify";

export default function ChatWithPDF() {
    const [file, setFile] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false);
    const [pdfText, setPdfText] = useState("");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warn("Please select a file");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("pdf", file);

        try {
            const { data } = await axios.post(
                "http://localhost:3000/api/ai/extract-text",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true,
                }
            );
            setPdfText(data.data.text);
            setIsUploaded(true);
            setMessages([{ role: "ai", content: `I've read **${file.name}**. What would you like to know about it?` }]);
            toast.success("PDF uploaded successfully!");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                const msg = error.response.data.message || "";
                if (msg.includes("Premium")) toast.error("💎 Premium Feature! Upgrade to use PDF Chat.");
                else toast.error("⚠️ Insufficient Credits!");
            } else {
                toast.error("Failed to upload/read PDF");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            // Send context + history + current message
            // We send last 6 messages as history to keep payload reasonable
            const recentHistory = messages.slice(-6);

            const { data } = await axios.post(
                "http://localhost:3000/api/ai/chat-pdf",
                {
                    context: pdfText,
                    message: userMessage,
                    history: recentHistory,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    withCredentials: true,
                }
            );

            setMessages((prev) => [...prev, { role: "ai", content: data.data.reply }]);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                const msg = error.response.data.message || "";
                if (msg.includes("Premium")) toast.error("💎 Premium Feature! Upgrade to keep chatting.");
                else if (msg.includes("credits")) toast.error("⚠️ Insufficient Credits!");
                else toast.error(msg);
                setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Error: Insufficient credits or premium access required." }]);
            } else {
                setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error answering that." }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const resetChat = () => {
        setFile(null);
        setIsUploaded(false);
        setPdfText("");
        setMessages([]);
        setInput("");
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-140px)] flex flex-col">
                {!isUploaded ? (
                    <div className="flex-1 flex flex-col justify-center items-center max-w-2xl mx-auto w-full">
                        <h1 className="text-3xl font-bold text-white mb-2">Chat with PDF</h1>
                        <p className="text-neutral-400 mb-8 text-center">Upload your document and ask questions about its content.</p>

                        <Card className="w-full p-10 space-y-6">
                            <div className="border-2 border-dashed border-neutral-700 bg-neutral-900/30 rounded-xl p-10 text-center hover:border-indigo-500 transition-colors">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                                    <UploadCloud className="w-12 h-12 text-indigo-500 mb-4" />
                                    <span className="text-lg font-medium text-white">
                                        {file ? file.name : "Click to Upload PDF"}
                                    </span>
                                    {!file && <span className="text-sm text-neutral-500 mt-2">Supports PDF files</span>}
                                </label>
                            </div>

                            <Button
                                onClick={handleUpload}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 text-lg"
                                disabled={loading || !file}
                            >
                                {loading ? "Reading Document..." : "Start Chatting"}
                            </Button>
                        </Card>
                    </div>
                ) : (
                    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl">
                        {/* Header */}
                        <div className="bg-white dark:bg-neutral-800 p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-red-600 dark:text-red-400">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                                        {file.name}
                                    </h3>
                                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Ready to chat
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={resetChat}
                                className="text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="End Chat"
                            >
                                <Trash2 size={20} />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-950">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === "user"
                                            ? "bg-indigo-600 text-white rounded-br-none"
                                            : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-gray-200 border border-neutral-200 dark:border-neutral-700 rounded-bl-none"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl rounded-bl-none border border-neutral-200 dark:border-neutral-700">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                            <div className="flex gap-3 relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                                    placeholder="Ask something about the document..."
                                    className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
