"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-200/70",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/30 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

export function SidebarSkeleton() {
  return (
    <div className="flex-1 flex flex-col py-6 px-4 space-y-6 overflow-hidden animate-pulse">
      <div className="px-2 mb-6 flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-5 w-28 rounded-md" />
      </div>

      <nav className="flex-1 space-y-6 px-0">
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-3">
            <Skeleton className="h-3 w-16 ml-2" />
            <div className="space-y-1.5">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-9 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </nav>
      
      <div className="pt-4 mt-auto border-t border-slate-100">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function KpiSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs min-h-[380px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-3 w-60" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <div className="flex-1 flex items-end gap-3 pb-4">
                {[40, 65, 30, 80, 55, 90, 70, 85].map((h, i) => (
                    <Skeleton 
                        key={i} 
                        className="flex-1 w-full rounded-t-md" 
                        style={{ height: `${h}%` }} 
                    />
                ))}
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
           <Skeleton className="h-8 w-44 rounded-lg" />
           <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
         <Skeleton className="h-10 flex-1 rounded-lg" />
         <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="bg-slate-50 p-3.5 border-b border-slate-200">
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
               <div className="flex gap-3 items-center">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-1.5">
                     <Skeleton className="h-4 w-36" />
                     <Skeleton className="h-3 w-20" />
                  </div>
               </div>
               <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
