import React from "react";

// ---------- Container ----------
export const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

// ---------- Card ----------
export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/70 dark:bg-neutral-900/60 backdrop-blur border border-neutral-200/60 dark:border-neutral-700 rounded-2xl shadow-sm p-5 ${className}`}
  >
    {children}
  </div>
);

// ---------- Input ----------
export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-xl border text-white border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    {...props}
  />
);

// ---------- Textarea ----------
export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full min-h-[140px] rounded-xl border  text-white border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    {...props}
  />
);

// ---------- Button ----------
export const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98]";
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    ghost:
      "bg-transparent border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800",
    subtle:
      "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200/80 dark:hover:bg-neutral-700",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// ---------- Select ----------
export const Select = ({ options = [], value, onChange, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full rounded-xl border text-white border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
  >
    {options.map((o) => (
      <option  key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);
