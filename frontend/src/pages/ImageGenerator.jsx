import React, { useEffect, useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Input, Button } from "../componets/ui";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ImageGenerator() {
    const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
    useEffect(() => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      }
    }, [navigate]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    const response=await axios.post("http://localhost:3000/api/ai/generate-image",{
      prompt,
    },{
      withCredentials: true
    })
    console.log("Image response:", response.data);
    setImageUrl(response.data.data.imageUrl);

    // Fake image generation
  
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
            className="rounded-lg border  border-neutral-200"
          />
        )}
      </Card>
    </DashboardLayout>
  );
}
