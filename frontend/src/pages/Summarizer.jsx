import React, { useState, useEffect } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Textarea, Button } from "../componets/ui";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

export default function Summarizer() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  // ✅ check token once when component mounts
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSummarize = () => {
    if (!text.trim()) {
      toast.warn("Please enter some text to summarize.");
      return;
    }

    axios
      .post(
        "http://localhost:3000/api/ai/summarize",
        { text },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // send token
          },
          withCredentials: true, // send cookie also
        }
      )
      .then((response) => {
        console.log("Summary response:", response.data.data.summary);
        setSummary(response.data.data.summary);
        toast.success("Summary generated!");
      })
      .catch((error) => {
        console.error("Error summarizing text:", error);
        if (error.response && error.response.status === 403) {
          toast.error("⚠️ Insufficient Credits! Please upgrade or wait.");
        } else {
          toast.error("Failed to summarize text. Please try again.");
        }
      });
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-4">AI Text Summarizer</h1>

      <Card className="space-y-4">
        <Textarea
          placeholder="Paste or type your text here..."
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={handleSummarize}
        >
          Summarize
        </Button>

        {summary && (
          <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Summary</h2>
            <p className="text-neutral-700 dark:text-neutral-300">{summary}</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
