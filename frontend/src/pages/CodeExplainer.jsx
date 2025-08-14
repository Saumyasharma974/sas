import React, { useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Textarea, Button } from "../componets/ui";

export default function CodeExplainer() {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");

  const handleExplain = () => {
    setExplanation("This is a placeholder explanation of the provided code.");
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
          <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
            <strong>Explanation:</strong> {explanation}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
