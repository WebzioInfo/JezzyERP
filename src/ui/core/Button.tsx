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
            primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 clay-btn",
            secondary: "bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20 clay-btn",
            outline: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm rounded-2xl",
            ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-2xl",
            danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 clay-btn",
            success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 clay-btn",
        }

        const sizes = {
            sm: "h-9 px-4 text-xs gap-1.5 rounded-xl font-bold",
            md: "h-12 px-6 text-sm gap-2 rounded-2xl font-extrabold uppercase tracking-widest",
            lg: "h-14 px-8 text-base gap-3 rounded-3xl font-black uppercase tracking-wider",
            icon: "h-11 w-11 p-0 rounded-2xl",
        }

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 font-display",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
              >
                {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : null}
                <span className="relative z-10">{children}</span>
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }

