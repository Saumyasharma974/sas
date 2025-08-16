import React, { useEffect, useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Textarea, Input, Button } from "../componets/ui"; // swapped Select → Input
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Translator() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("Spanish");
  const [translation, setTranslation] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleTranslate = async () => {
    if (!text.trim()) {
      alert("Please enter some text to translate.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/ai/translate",
        {
          text,
          language,
        },
        { withCredentials: true }
      );
      setTranslation(response.data.data.translation);
    } catch (err) {
      console.error("Translation error:", err);
      alert("❌ Failed to translate. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-4">AI Translator</h1>
      <Card className="space-y-4">
        <Textarea
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />

        {/* Replaced dropdown with Input */}
        <Input
          placeholder="Enter target language (e.g. Spanish, French, Hindi)"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />

        <Button onClick={handleTranslate}>Translate</Button>

        {translation && (
          <div className="bg-neutral-100 text-white dark:bg-neutral-800 p-3 rounded-lg">
            <strong>Translation:</strong> {translation}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
