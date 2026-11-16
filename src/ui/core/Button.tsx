import * as React from "react"
import { cn } from "@/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success"
    size?: "sm" | "md" | "lg" | "icon"
    loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xs border border-transparent",
            secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs",
            outline: "bg-transparent text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs",
            ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            danger: "bg-red-600 text-white hover:bg-red-700 shadow-xs border border-transparent",
            success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs border border-transparent",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs gap-1.5 rounded-lg font-medium",
            md: "h-9 px-3.5 text-sm gap-2 rounded-lg font-medium",
            lg: "h-10 px-4 text-sm gap-2 rounded-lg font-medium",
            icon: "h-9 w-9 p-0 rounded-lg",
        }

        const spinnerColors = {
            primary: "border-white/30 border-t-white",
            secondary: "border-slate-300 border-t-slate-700",
            outline: "border-slate-300 border-t-slate-700",
            ghost: "border-slate-300 border-t-slate-700",
            danger: "border-white/30 border-t-white",
            success: "border-white/30 border-t-white",
        }

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-1 select-none cursor-pointer",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
              >
                {loading ? (
                    <div className={cn("h-3.5 w-3.5 border-2 rounded-full animate-spin shrink-0 mr-2", spinnerColors[variant])} />
                ) : null}
                <span className="relative z-10 flex items-center justify-center gap-[inherit]">{children}</span>
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
