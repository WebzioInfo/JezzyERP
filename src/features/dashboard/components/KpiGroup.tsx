import { db } from "@/db/prisma/client";
import { formatCurrency } from "@/utils/financials";
import { 
    TrendingUp, 
    IndianRupee, 
    AlertTriangle, 
    Users, 
    Wallet, 
    Building2,
    Briefcase,
    TrendingDown
} from "lucide-react";
import { Card } from "@/ui/core/Card";
import { FinanceService } from "@/features/billing/services/FinanceService";

export async function KpiGroup() {
    const accounts = await (db.account as any).findMany();
    
    // Calculate balances per type using FinanceService logic
    // In a real high-load scenario, we would use a more optimized batch query
    // but for now, we'll aggregate from the DB records.
    
    const clientAccounts = accounts.filter((a: any) => a.type === 'CLIENT');
    const supplierAccounts = accounts.filter((a: any) => a.type === 'SUPPLIER');
    const liquidAccounts = accounts.filter((a: any) => ['BANK', 'CASH'].includes(a.type));
    const equityAccounts = accounts.filter((a: any) => a.type === 'EQUITY');

    // Helper to get sum of balances for a set of accounts
    const sumBalances = async (accList: any[]) => {
        const balances = await Promise.all(accList.map(a => FinanceService.getAccountBalance(a.id)));
        return balances.reduce((sum, b) => sum + b, 0);
    };

    const [receivables, payables, liquidCash, equity] = await Promise.all([
        sumBalances(clientAccounts),
        sumBalances(supplierAccounts),
        sumBalances(liquidAccounts),
        sumBalances(equityAccounts)
    ]);

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in stagger-1">
            <KpiCard
                label="Liquid Liquidity"
                value={formatCurrency(liquidCash)}
                icon={<Wallet className="w-6 h-6" />}
                color="emerald"
                subtitle="Bank + Petty Cash"
            />
            <KpiCard
                label="Total Receivables"
                value={formatCurrency(Math.abs(receivables))}
                icon={<TrendingUp className="w-6 h-6" />}
                color="primary"
                subtitle="From active clients"
            />
            <KpiCard
                label="Total Payables"
                value={formatCurrency(Math.abs(payables))}
                icon={<TrendingDown className="w-6 h-6" />}
                color="danger"
                subtitle="Due to suppliers"
            />
            <KpiCard
                label="Owner Equity"
                value={formatCurrency(Math.abs(equity))}
                icon={<Briefcase className="w-6 h-6" />}
                color="accent"
                subtitle="Founder capital"
            />
        </div>
    );
}


function KpiCard({ label, value, icon, color, subtitle }: {
    label: string; value: string; icon: React.ReactNode; color: "primary" | "accent" | "danger" | "emerald"; subtitle: string;
}) {
    const themes = {
        primary: { glow: "shadow-primary-600/20", iconBg: "bg-primary-600", accent: "primary-500", textAccent: "text-primary-500", bgAccent: "bg-primary-500" },
        accent: { glow: "shadow-accent-500/20", iconBg: "bg-accent-500", accent: "accent-500", textAccent: "text-accent-500", bgAccent: "bg-accent-500" },
        danger: { glow: "shadow-red-600/20", iconBg: "bg-red-600", accent: "red-500", textAccent: "text-red-500", bgAccent: "bg-red-500" },
        emerald: { glow: "shadow-emerald-600/20", iconBg: "bg-emerald-600", accent: "emerald-500", textAccent: "text-emerald-500", bgAccent: "bg-emerald-500" },
    };
    const theme = themes[color];

    return (
        <Card className="p-8 border-0 group hover:scale-[1.03] active:scale-95 transition-all duration-500 relative overflow-hidden shadow-2xl shadow-slate-200/50">
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-10 ${theme.bgAccent}`} />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center text-white shadow-xl ${theme.glow} group-hover:rotate-12 transition-all duration-500 border border-white/20`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                </div>
            </div>

            <div className="space-y-2 pb-2 relative z-10">
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none font-display">{value}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
            </div>

            <div className={`h-1 w-0 group-hover:w-full transition-all duration-700 ${theme.bgAccent} absolute bottom-0 left-0`} />
        </Card>
    );
}
