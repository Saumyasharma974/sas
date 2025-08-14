import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, Image, Code, Languages, User } from "lucide-react";

const navItems = [
  { to: "/summarizer", label: "Summarizer", icon: FileText },
  { to: "/image-generator", label: "Image Generator", icon: Image },
  { to: "/code-explainer", label: "Code Explainer", icon: Code },
  { to: "/translator", label: "Translator", icon: Languages },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  return (
    <aside className="bg-white text-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 w-64 min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6">AI SaaS</h1>
      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
