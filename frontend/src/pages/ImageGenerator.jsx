import React, { useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Input, Button } from "../componets/ui";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleGenerate = () => {
    // Fake image generation
    setImageUrl("https://via.placeholder.com/512x512?text=AI+Image");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl text-white  font-bold mb-4">AI Image Generator</h1>
      <Card className="space-y-4">
        <Input
          placeholder="Enter your image prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button onClick={handleGenerate}>Generate</Button>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded-lg border border-neutral-200"
          />
        )}
      </Card>
    </DashboardLayout>
  );
}
