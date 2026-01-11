import React, { useEffect, useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Textarea, Button } from "../componets/ui";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";

export default function CodeExplainer() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);


  const handleExplain = async () => {
    if (!code.trim()) {
      toast.warn("Please enter some code to explain.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/ai/explain-code",
        {
          code,
        },
        { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setExplanation(response.data.data.explanation);
      toast.success("Code explained!");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        const msg = error.response.data.message || "";
        if (msg.includes("Premium")) toast.error("💎 Premium Feature! Please upgrade.");
        else toast.error("⚠️ Insufficient Credits!");
      } else {
        toast.error("Failed to explain code.");
      }
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl  text-white font-bold mb-4">AI Code Explainer</h1>
      <Card className="space-y-4">
        <Textarea
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
        />
        <Button onClick={handleExplain}>Explain</Button>
        {explanation && (
          <div className="bg-neutral-100 text-white dark:bg-neutral-800 p-3 rounded-lg">
            <strong>Explanation:</strong> {explanation}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
