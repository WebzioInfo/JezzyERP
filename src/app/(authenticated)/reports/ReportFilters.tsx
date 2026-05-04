"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/utils/index";

const RANGES = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "This Month", value: "this-month" },
    { label: "Last Month", value: "last-month" },
    { label: "This Quarter", value: "this-quarter" },
    { label: "Full History", value: "all" },
];

export function ReportFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRange = searchParams.get("range") || "30d";

    const setRange = (range: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("range", range);
        router.push(`/reports?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {RANGES.map((range) => (
                <button
                    key={range.value}
                    onClick={() => setRange(range.value)}
                    className={cn(
                        "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        currentRange === range.value
                            ? "bg-slate-900 text-white shadow-xl scale-105"
                            : "bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600 ring-1 ring-slate-100"
                    )}
                >
                    {range.label}
                </button>
            ))}
            
            <div className="h-10 w-px bg-slate-100 mx-2 hidden lg:block" />
            
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl ring-1 ring-slate-100 shadow-sm opacity-50 cursor-not-allowed">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custom Range</span>
                <ChevronDown size={14} className="text-slate-400" />
            </div>
        </div>
    );
}
