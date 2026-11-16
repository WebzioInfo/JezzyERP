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
            <div className={cn("space-y-1.5", containerClassName)}>
                {label && (
                    <label className="text-xs font-medium text-slate-700 block">
                        {label}
                    </label>
                )}
                <div className="relative group/field">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-slate-900 transition-colors pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "flex w-full h-10 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 shadow-xs transition-colors",
                            "focus-visible:outline-none focus-visible:border-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900/10",
                            "placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50",
                            icon ? "pl-9 pr-3" : "px-3",
                            error ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : "",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs font-medium text-red-600 tracking-tight">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";
