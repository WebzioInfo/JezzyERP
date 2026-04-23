import { db } from "@/db/prisma/client";
import { formatCurrency } from "@/utils/financials";
import { TrendingUp, IndianRupee, AlertTriangle, Users } from "lucide-react";

export async function KpiGroup() {
    const [
        clientCount,
        productCount,
        revenueAgg,
        overdueAgg,
        monthlyRevenue,
    ] = await Promise.all([
        db.client.count({ where: { deletedAt: null } }),
        db.product.count({ where: { deletedAt: null } }),
        db.invoice.aggregate({
            where: { deletedAt: null, status: { in: ["PAID", "PARTIAL"] } },
            _sum: { grandTotal: true },
        }),
        db.invoice.aggregate({
            where: { deletedAt: null, status: { in: ["SENT", "OVERDUE", "DRAFT"] } },
            _sum: { grandTotal: true },
        }),
        db.invoice.aggregate({
            where: {
                deletedAt: null,
                status: { in: ["PAID", "PARTIAL"] },
                date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            _sum: { grandTotal: true },
        }),
    ]);

    const totalRevenue = revenueAgg._sum.grandTotal?.toNumber() || 0;
    const totalOutstanding = overdueAgg._sum.grandTotal?.toNumber() || 0;
    const thisMonthRevenue = monthlyRevenue._sum.grandTotal?.toNumber() || 0;

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in stagger-1">
            <KpiCard
                label="Cumulative Revenue"
                value={formatCurrency(totalRevenue)}
                icon={<TrendingUp className="w-6 h-6" />}
                color="primary"
                subtitle="All-time verified payments"
            />
            <KpiCard
                label="MOM Performance"
                value={formatCurrency(thisMonthRevenue)}
                icon={<IndianRupee className="w-6 h-6" />}
                color="accent"
                subtitle="Current month trajectory"
            />
            <KpiCard
                label="Total Receivables"
                value={formatCurrency(totalOutstanding)}
                icon={<AlertTriangle className="w-6 h-6" />}
                color="danger"
                subtitle="Action required on debt"
            />
            <KpiCard
                label="Active Partners"
                value={clientCount.toString()}
                icon={<Users className="w-6 h-6" />}
                color="emerald"
                subtitle={`${productCount} items in inventory`}
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
        <div className="glass clay-card p-8 border-0 group hover:scale-[1.03] active:scale-95 transition-all duration-500 relative overflow-hidden">
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-10 ${theme.bgAccent}`} />

            <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center text-white shadow-xl ${theme.glow} group-hover:rotate-12 transition-all duration-500 border border-white/20`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                </div>
            </div>

            <div className="space-y-2 pb-2">
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none font-display">{value}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
            </div>

            <div className={`h-1 w-0 group-hover:w-full transition-all duration-700 ${theme.bgAccent} absolute bottom-0 left-0`} />
        </div>
    );
}
