import { db } from "@/db/prisma/client";
import { formatCurrency } from "@/utils/financials";
import { 
    TrendingUp, 
    Wallet, 
    Briefcase,
    TrendingDown
} from "lucide-react";
import { Card } from "@/ui/core/Card";
import { FinanceService } from "@/features/billing/services/FinanceService";

export async function KpiGroup() {
    const accounts = await (db.account as any).findMany();
    
    const clientAccounts = accounts.filter((a: any) => a.type === 'CLIENT');
    const supplierAccounts = accounts.filter((a: any) => a.type === 'SUPPLIER');
    const liquidAccounts = accounts.filter((a: any) => ['BANK', 'CASH'].includes(a.type));
    const equityAccounts = accounts.filter((a: any) => a.type === 'EQUITY');

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
                label="Liquid Cash"
                value={formatCurrency(liquidCash)}
                icon={<Wallet className="w-5 h-5 text-slate-700" />}
                subtitle="Bank + Petty Cash"
            />
            <KpiCard
                label="Total Receivables"
                value={formatCurrency(Math.abs(receivables))}
                icon={<TrendingUp className="w-5 h-5 text-slate-700" />}
                subtitle="From active clients"
            />
            <KpiCard
                label="Total Payables"
                value={formatCurrency(Math.abs(payables))}
                icon={<TrendingDown className="w-5 h-5 text-slate-700" />}
                subtitle="Due to suppliers"
            />
            <KpiCard
                label="Owner Equity"
                value={formatCurrency(Math.abs(equity))}
                icon={<Briefcase className="w-5 h-5 text-slate-700" />}
                subtitle="Founder capital"
            />
        </div>
    );
}

function KpiCard({ label, value, icon, subtitle }: {
    label: string; value: string; icon: React.ReactNode; subtitle: string;
}) {
    return (
        <Card className="p-5 border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <h4 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none truncate" title={value}>{value}</h4>
                <p className="text-xs text-slate-400 truncate" title={subtitle}>{subtitle}</p>
            </div>
        </Card>
    );
}
