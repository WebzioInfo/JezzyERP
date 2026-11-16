import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import { PaymentService } from "@/features/billing/services/PaymentService";
import { db } from "@/db/prisma/client";
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { LiveSearch } from "@/components/common/LiveSearch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/ui/core/Table";

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const { q: searchQuery = "" } = await searchParams;

  const [invoices, purchases, clients] = await Promise.all([
    (db.invoice as any).findMany({
      where: { deletedAt: null, status: { notIn: ["PAID", "CANCELLED"] } },
      select: { grandTotal: true, allocations: { select: { amount: true } } }
    }),
    (db.purchase as any).findMany({
      where: { deletedAt: null, status: { notIn: ["PAID", "CANCELLED"] } },
      select: { grandTotal: true, allocations: { select: { amount: true } } }
    }),
    db.client.findMany({
      where: { active: true },
      include: {
        invoices: {
          where: { deletedAt: null },
          select: { grandTotal: true }
        },
        payments: {
          where: { deletedAt: null },
          select: { amount: true }
        }
      } as any
    })
  ]);

  const incomingCredit = invoices.reduce((sum: number, inv: any) => {
      const allocated = (inv as any).allocations.reduce((a: number, b: any) => a + Number(b.amount), 0);
      return sum + (Number(inv.grandTotal) - allocated);
  }, 0);
  
  const outgoingCredit = purchases.reduce((sum: number, pur: any) => {
      const allocated = (pur as any).allocations.reduce((a: number, b: any) => a + Number(b.amount), 0);
      return sum + (Number(pur.grandTotal) - allocated);
  }, 0);

  const clientData = clients.map(client => {
    let billed = 0;
    let paid = 0;
    client.invoices.forEach((inv: any) => {
      billed += Number(inv.grandTotal);
    });
    client.payments.forEach((pay: any) => {
      paid += Number(pay.amount);
    });
    return {
      id: client.id,
      name: client.name,
      billed,
      paid,
      pending: billed - paid
    };
  }).filter(c => c.billed > 0).sort((a, b) => b.pending - a.pending);

  const filteredClients = searchQuery 
    ? clientData.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : clientData;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments & Credit Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor accounts receivable (Incoming) and accounts payable (Outgoing) credits
          </p>
        </div>

        <Link href="/payments/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span>Record Payment</span>
          </Button>
        </Link>
      </div>

      {/* Credit Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-emerald-200/80 bg-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Incoming Credit (Receivable)</span>
              </div>
              <span className="text-xs text-emerald-700 font-medium">{invoices.length} active invoices</span>
            </div>
            <h2 className="text-3xl font-bold tabular-nums text-emerald-900 tracking-tight">{formatCurrency(incomingCredit)}</h2>
            <p className="mt-1 text-xs text-emerald-700 font-medium">Outstanding payments due from clients</p>
          </CardContent>
        </Card>

        <Card className="border border-rose-200/80 bg-rose-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-rose-800">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Outgoing Credit (Payable)</span>
              </div>
              <span className="text-xs text-rose-700 font-medium">{purchases.length} bills</span>
            </div>
            <h2 className="text-3xl font-bold tabular-nums text-rose-900 tracking-tight">{formatCurrency(outgoingCredit)}</h2>
            <p className="mt-1 text-xs text-rose-700 font-medium">Pending vendor settlements</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <LiveSearch 
          placeholder="Filter by Client Name..." 
          className="w-full sm:max-w-xs"
        />
        <span className="text-xs font-medium text-slate-500 self-start sm:self-auto">
          Showing {filteredClients.length} clients with activity
        </span>
      </div>

      {/* Client Payments List */}
      <Card>
        <CardContent className="p-0">
          {filteredClients.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900">No client payment data found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try adjusting your search criteria or create a new invoice to start tracking payments.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead className="text-right">Total Billed</TableHead>
                  <TableHead className="text-right">Amount Paid</TableHead>
                  <TableHead className="text-right">Pending Balance</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium text-slate-900">
                      <Link href={`/clients/${client.id}`} className="hover:text-primary-600 transition-colors">
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-600 tabular-nums">
                      {formatCurrency(client.billed)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-600 tabular-nums">
                      {formatCurrency(client.paid)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      <span className={client.pending > 0 ? 'text-rose-600' : 'text-slate-500'}>
                        {formatCurrency(client.pending)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/clients/${client.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900">
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
