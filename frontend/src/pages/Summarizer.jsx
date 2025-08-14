import React, { useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Textarea, Button } from "../componets/ui";

export default function Summarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = () => {
    if (!text.trim()) {
      alert("Please enter some text to summarize.");
      return;
    }
    // Fake AI response for now
    setSummary("This is a short placeholder summary of your provided text.");
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
