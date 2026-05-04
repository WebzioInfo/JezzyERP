import * as React from "react"
import { cn } from "@/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-1 mb-2",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
