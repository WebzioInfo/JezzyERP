"use client";

import * as React from "react"
import { cn } from "@/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5 relative">
                {label && (
                    <label className="block text-xs font-medium text-slate-700">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex w-full rounded-lg border border-slate-300 bg-white text-sm shadow-xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 h-10",
                            icon ? "pl-9 pr-3" : "px-3",
                            error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
                            className
                        )}
                        ref={ref}
                        onClick={(e) => {
                            if (type === "date" || type === "time") {
                                try { (e.target as HTMLInputElement).showPicker(); } catch {}
                            }
                            props.onClick?.(e);
                        }}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs font-medium text-red-600 tracking-tight">{error}</p>}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
