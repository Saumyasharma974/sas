import React, { useEffect, useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Input, Button } from "../componets/ui";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";

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
      toast.warn("Please enter a prompt.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/ai/generate-image", {
        prompt,
      }, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      console.log("Image response:", response.data);
      setImageUrl(response.data.data.imageUrl);
      toast.success("Image generated!");
    } catch (error) {
      console.error("Image gen error:", error);
      if (error.response && error.response.status === 403) {
        const msg = error.response.data.message || "";
        if (msg.includes("Premium")) {
          toast.error("💎 Premium Feature! Please upgrade to Pro.");
        } else if (msg.includes("credits")) {
          toast.error("⚠️ Insufficient Credits! Please purchase more.");
        } else {
          toast.error(msg || "Access Denied");
        }
      } else {
        toast.error("Failed to generate image.");
      }
    }

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
