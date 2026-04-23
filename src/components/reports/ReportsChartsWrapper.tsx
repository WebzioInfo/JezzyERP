'use client';

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/ui/core/Skeleton";

const RevenueChart = dynamic(() => import("./RevenueChart").then(mod => mod.RevenueChart), {
   loading: () => <ChartSkeleton />,
   ssr: false
});

const ClientRevenuePie = dynamic(() => import("./ClientRevenuePie").then(mod => mod.ClientRevenuePie), {
   loading: () => <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-3xl animate-pulse"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>,
   ssr: false
});

export function ReportsChartsWrapper({ monthlyRevenue, clientRevenue }: { monthlyRevenue: any, clientRevenue: any }) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 card border-0 shadow-lg ring-1 ring-slate-100 p-0 overflow-hidden group">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between group-hover:bg-slate-100/50 transition-colors">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Revenue Growth Trend
                    </h3>
                </div>
                <div className="p-6">
                    <RevenueChart data={monthlyRevenue} />
                </div>
            </div>

            <div className="card border-0 shadow-lg ring-1 ring-slate-100 p-0 overflow-hidden group">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between group-hover:bg-slate-100/50 transition-colors">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                        Revenue by Key Client
                    </h3>
                </div>
                <div className="p-6">
                    <ClientRevenuePie data={clientRevenue} />
                </div>
            </div>
        </div>
    );
}
