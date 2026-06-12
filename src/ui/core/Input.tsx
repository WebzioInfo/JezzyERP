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
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex w-full rounded-md border border-slate-300 bg-white text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 h-10",
                            icon ? "pl-10 pr-3" : "px-3",
                            error && "border-red-500 focus-visible:ring-red-500",
                            className
                        )}
                        ref={ref}
                        onClick={(e) => {
                            if (type === "date" || type === "time") {
                                try { (e.target as HTMLInputElement).showPicker(); } catch (err) {}
                            }
                            props.onClick?.(e);
                        }}
                        {...props}
                    />
                </div>
                {error && <p className="text-[11px] font-medium text-red-500 tracking-tight">{error}</p>}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }

