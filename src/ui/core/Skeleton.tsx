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
      className={cn("animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-800/60", className)}
      {...props}
    />
  );
}

export function SidebarSkeleton() {
  return (
    <div className="flex-1 flex flex-col py-8 px-4 space-y-8 overflow-hidden animate-pulse">
      <div className="px-4 mb-10 flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <nav className="flex-1 space-y-8 px-0">
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-4">
            <Skeleton className="h-3 w-20 ml-4" />
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-12 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        ))}
      </nav>
      
      <div className="pt-6 mt-auto space-y-4">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function KpiSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass clay-card p-8 border-0">
                    <div className="flex items-center justify-between mb-6">
                        <Skeleton className="w-12 h-12 rounded-2xl" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="space-y-2 pb-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="glass clay-card p-8 border-0 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="flex-1 flex items-end gap-2 pb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton 
                        key={i} 
                        className="flex-1 w-full" 
                        style={{ height: `${Math.random() * 60 + 20}%` }} 
                    />
                ))}
            </div>
        </div>
    );
}


export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in p-1">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
           <Skeleton className="h-10 w-48 rounded-xl" />
           <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-12 w-40 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_: any, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-96 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
         <Skeleton className="h-12 flex-1 rounded-2xl" />
         <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>
      <div className="card p-0 overflow-hidden border-0 ring-1 ring-slate-100">
        <div className="bg-slate-50 p-4 border-b border-slate-100">
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(8)].map((_: any, i) => (
            <div key={i} className="flex justify-between items-center py-2">
               <div className="flex gap-4 items-center">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-40" />
                     <Skeleton className="h-3 w-24" />
                  </div>
               </div>
               <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
