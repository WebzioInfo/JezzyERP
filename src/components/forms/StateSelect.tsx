"use client";

import React from "react";
import { INDIAN_STATES } from "@/lib/constants/states";
import { cn } from "@/utils";

interface StateSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function StateSelect({ label, error, icon, className, ...props }: StateSelectProps) {
  return (
    <div className="w-full space-y-1.5 focus-within:z-10 relative">
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          className={cn(
            "flex w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:outline-none focus:border-0 hover:ring-slate-300 appearance-none",
            icon ? "pl-11" : "pl-4",
            error && "ring-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        >
          <option value="" disabled>Select State</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-[10px] font-bold text-red-500 tracking-tight ml-1">{error}</p>}
    </div>
  );
}
