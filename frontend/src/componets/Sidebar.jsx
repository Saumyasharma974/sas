import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, Image, Code, Languages, User, Bug, PenTool, Hash, FileCheck, MessageSquare } from "lucide-react";

const navItems = [
  { to: "/summarizer", label: "Summarizer", icon: FileText },
  { to: "/chat-pdf", label: "Chat with PDF", icon: MessageSquare },
  { to: "/write-article", label: "Write Article", icon: PenTool },
  { to: "/blog-titles", label: "Blog Titles", icon: Hash },
  { to: "/image-generator", label: "Image Generator", icon: Image },
  { to: "/code-explainer", label: "Code Explainer", icon: Code },
  { to: "/translator", label: "Translator", icon: Languages },
  { to: "/resume-review", label: "Review Resume", icon: FileCheck },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/debugger", label: "Debugger", icon: Bug },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside
        className={`
          fixed md:sticky top-0 inset-y-0 left-0 z-50
          w-64 h-screen bg-white text-neutral-900 dark:text-white dark:bg-neutral-900 
          border-r border-neutral-200 dark:border-neutral-800 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          p-4 overflow-y-auto
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">AI SaaS</h1>
          {/* Mobile close button inside sidebar (optional, but good for UX) */}
          <button onClick={onClose} className="md:hidden text-neutral-500">
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
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
    </>
  );
}
