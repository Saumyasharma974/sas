import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Topbar({ onToggleSidebar }) {
  const [username, setUsername] = React.useState("");
  const [quota, setQuota] = React.useState(0);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/auth/me/${userId}`, { withCredentials: true });
        setUsername(response.data.user.email);
        setQuota(response.data.user.credits);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [userId]);

  const handleGoHome = () => {
    navigate("/"); // Navigate to landing page
  };

  return (
    <header className="flex justify-between items-center text-white bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 md:px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Dashboard</h2>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="text-sm text-neutral-600 dark:text-neutral-300 hidden md:block">
          Quota left: <span className="font-bold">{quota}</span>
        </div>
        {/* Mobile simple quota */}
        <div className="text-xs text-neutral-600 dark:text-neutral-300 md:hidden">
          Quota: {quota}
        </div>

        <div className="hidden md:block bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">
          {username}
        </div>
        <button
          onClick={handleGoHome}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
        >
          Home
        </button>
      </div>
    </header>
  );
}
