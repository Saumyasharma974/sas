import React, { useEffect, useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card, Textarea, Button } from "../componets/ui";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CodeDebugger() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [bugs, setBugs] = useState("");
  const [correctedCode, setCorrectedCode] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleDebug = async () => {
    if (!code.trim()) {
      alert("⚠️ Please enter some code to debug.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/ai/debug-code",
        { code },
        { withCredentials: true }
      );
      console.log("Debug response:", response.data);
      console.log(response.data.data.bugsFound);
      console.log(response.data.data.correctedCode);
      setBugs(response.data.data.bugsFound);
      setCorrectedCode(response.data.data.correctedCode);
    } catch (err) {
      console.error("Debug error:", err);
      alert("❌ Something went wrong while debugging. Try again.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl text-white font-bold mb-4">AI Code Debugger</h1>
      <Card className="space-y-4">
        <Textarea
          placeholder="Paste your buggy code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
        />
        <Button onClick={handleDebug}>Find & Fix Bugs</Button>

        {(bugs || correctedCode) && (
          <div className="space-y-4">
            {bugs && (
              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-lg">
                <strong>🔎 Bugs Found:</strong>
                <p>{bugs}</p>
              </div>
            )}
            {correctedCode && (
              <div className="bg-green-10`0 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-lg">
                <strong>✅ Corrected Code:</strong>
                <pre className="mt-2 whitespace-pre-wrap">{correctedCode}</pre>
              </div>
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
