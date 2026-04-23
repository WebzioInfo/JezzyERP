import { KpiSkeleton, ChartSkeleton } from "@/ui/core/Skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <div className="h-3 w-32 bg-slate-200 animate-pulse rounded" />
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded" />
            </div>
            
            <KpiSkeleton />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ChartSkeleton />
                </div>
                <div className="lg:col-span-1">
                    <div className="glass clay-card p-8 border-0 min-h-[400px]">
                        <div className="h-6 w-40 bg-slate-200 animate-pulse rounded mb-6" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-full bg-slate-200 animate-pulse rounded" />
                                        <div className="h-3 w-2/3 bg-slate-200 animate-pulse rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
