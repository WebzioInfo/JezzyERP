import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <div className="text-slate-500 font-medium animate-pulse">
                Loading dashboard data...
            </div>
            
            {/* Optional Skeleton structure for deeper visual feedback */}
            <div className="w-full max-w-4xl space-y-6 mt-8 opacity-50">
                <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-64 bg-slate-200 rounded-xl w-full animate-pulse"></div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
