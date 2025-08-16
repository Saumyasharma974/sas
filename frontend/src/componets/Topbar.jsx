import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
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
    <header className="flex justify-between items-center text-white bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-3">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="flex items-center gap-6">
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          Quota left: <span className="font-bold">{quota}</span>
        </div>
        <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg">
          {username}
        </div>
        <button
          onClick={handleGoHome}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
        >
          Home
        </button>
      </div>
    </header>
  );
}
