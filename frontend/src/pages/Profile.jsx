import React, { useEffect, useState } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card } from "../componets/ui";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";

// Helper to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      // Also ensure we have userId, if not decode from token or fetch me first
      // For now assuming userId exists in local storage as per your flow
      if (!userId) {
        // fallback if needed
      }
    }
  }, [navigate, userId]);

  useEffect(() => {
    console.log("Profile mounted, userId:", userId);
    const fetchData = async () => {
      try {
        console.log("Fetching profile data...");
        const [userRes, historyRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/auth/me/${userId}`, { withCredentials: true }),
          axios.get("http://localhost:3000/api/auth/history", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true
          })
        ]);
        console.log("User data:", userRes.data);
        console.log("History data:", historyRes.data);
        setUser(userRes.data.user);
        setHistory(historyRes.data.data.history);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    if (userId) fetchData();
    else console.warn("No userId found in localStorage");
  }, [userId]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Profile & History</h1>

          <Card className="mb-8 border-l-4 border-indigo-600">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{user?.name}</h2>
                <p className="text-neutral-500 dark:text-neutral-400">{user?.email}</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 rounded-2xl text-center">
                <span className="block text-xs uppercase tracking-wider text-indigo-500 font-semibold mb-1">Credits Remaining</span>
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{user?.credits}</span>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-4 rounded-2xl text-center">
                <span className="block text-xs uppercase tracking-wider text-purple-500 font-semibold mb-1">Current Plan</span>
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {user?.isPremium ? "Pro" : "Free"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={20} className="text-neutral-500" />
            Generation History
          </h2>

          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => (
                <HistoryItem key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-neutral-500 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border-dashed border-2 border-neutral-200 dark:border-neutral-700">
              No history found. Start creating!
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Sub-component for individual history item
function HistoryItem({ item }) {
  const [expanded, setExpanded] = useState(false);

  // Helper to render output based on type (simple text vs object/array)
  const renderOutput = () => {
    if (typeof item.output === "string") return item.output;
    if (Array.isArray(item.output)) return item.output.join("\n");
    if (typeof item.output === "object" && item.output !== null) {
      return JSON.stringify(item.output, null, 2);
    }
    return String(item.output);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden transition-all hover:shadow-md">
      <div
        className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer bg-neutral-50/50 dark:bg-neutral-800/30"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center shrink-0
            ${item.type === 'Image Generator' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}
            dark:bg-neutral-800 dark:text-neutral-300
          `}>
            {/* We could map icons here, for now just first letter */}
            <span className="font-bold">{item.type[0]}</span>
          </div>
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-white">{item.type}</h3>
            <p className="text-xs text-neutral-500">{formatDate(item.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-400">
          <span className="text-sm hidden md:inline-block max-w-[200px] truncate">
            {typeof item.input === 'string' ? item.input : 'Complex Input'}
          </span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Input</span>
            <div className="mt-1 p-3 bg-neutral-100 dark:bg-neutral-950 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 overflow-x-auto whitespace-pre-wrap">
              {typeof item.input === 'string' ? item.input : JSON.stringify(item.input, null, 2)}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Output</span>
            <div className="mt-1 p-3 bg-neutral-100 dark:bg-neutral-950 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 overflow-x-auto whitespace-pre-wrap">
              {item.type === 'Image Generator' ? (
                <img src={item.output} alt="Generated" className="max-w-full h-auto rounded-lg" />
              ) : (
                renderOutput()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
