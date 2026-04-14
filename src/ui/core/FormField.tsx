import React from "react";
import { cn } from "@/utils/index";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    containerClassName?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, error, icon, containerClassName, className, ...props }, ref) => {
        return (
            <div className={cn("space-y-2", containerClassName)}>
                {label && (
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-1">
                        {label}
                    </label>
                )}
                <div className="relative group/field">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-primary-500 transition-colors duration-300">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full h-12 bg-slate-50 border-0 rounded-2xl text-sm font-bold shadow-inner ring-1 ring-slate-200 transition-all duration-300",
                            "focus:ring-2 focus:ring-primary-500/20 focus:bg-white focus:outline-none",
                            "placeholder:text-slate-300 placeholder:italic",
                            icon ? "pl-11 pr-4" : "px-4",
                            error ? "ring-red-200 bg-red-50/30" : "hover:ring-slate-300",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-[10px] font-bold text-red-500 px-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";
