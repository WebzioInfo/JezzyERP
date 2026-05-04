import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-700">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center border border-primary-100 shadow-2xl">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
        <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-2xl animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">Syncing Data...</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Processing Secure Protocol</p>
      </div>
    </div>
  );
}
