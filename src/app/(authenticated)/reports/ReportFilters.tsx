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
        <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex flex-wrap p-1 bg-slate-100 rounded-lg border border-slate-200">
                {RANGES.map((range) => (
                    <button
                        key={range.value}
                        onClick={() => setRange(range.value)}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                            currentRange === range.value
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                        )}
                    >
                        {range.label}
                    </button>
                ))}
            </div>
            
            <div className="hidden lg:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-400 cursor-not-allowed">
                <Calendar size={14} className="text-slate-400" />
                <span>Custom Range</span>
                <ChevronDown size={14} className="text-slate-400" />
            </div>
        </div>
    );
}
