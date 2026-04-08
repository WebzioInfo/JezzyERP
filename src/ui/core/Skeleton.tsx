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
      className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
      {...props}
    />
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
        {[...Array(4)].map((_, i) => (
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
          {[...Array(8)].map((_, i) => (
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
