import React, { useEffect, useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Textarea, Button } from "../componets/ui";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      alert("Please enter some code to explain.");
      return;
    }
    // Call the API to get the explanation
    const response = await axios.post(
      "http://localhost:3000/api/ai/explain-code",
      {
        code,
      },
      { withCredentials: true }
    );
    setExplanation(response.data.data.explanation);
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
