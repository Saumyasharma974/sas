import React, { useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Textarea, Select, Button } from "../componets/ui";

export default function Translator() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("Spanish");
  const [translation, setTranslation] = useState("");

  const handleTranslate = () => {
    setTranslation(`(Translated to ${language}) This is a placeholder translation.`);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold  text-white mb-4">AI Translator</h1>
      <Card className="space-y-4">
        <Textarea
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
          <option>Japanese</option>
        </Select>
        <Button onClick={handleTranslate}>Translate</Button>
        {translation && (
          <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
            <strong>Translation:</strong> {translation}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
