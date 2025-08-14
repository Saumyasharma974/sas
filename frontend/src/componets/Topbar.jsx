import React from "react";

export default function Topbar({ username = "User", quota = 10 }) {
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
      </div>
    </header>
  );
}
