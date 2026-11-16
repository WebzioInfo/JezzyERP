import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Trash2, FileText, ClipboardList, Package } from "lucide-react";
import { Card, CardContent } from "@/ui/core/Card";
import { formatCurrency } from "@/utils/financials";
import { InvoiceListActions } from "@/features/billing/components/InvoiceListActions";
import { QuotationListActions } from "@/features/billing/components/QuotationListActions";
import { PurchaseListActions } from "@/features/procurement/components/PurchaseListActions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/ui/core/Table";

export default async function TrashPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const [invoices, quotations, purchases] = await Promise.all([
    db.invoice.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
      include: { client: { select: { name: true } } },
    }),
    db.quotation.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
      include: { client: { select: { name: true } } },
    }),
    db.purchase.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
    }),
  ]);

  const totalTrash = invoices.length + quotations.length + purchases.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Trash & Recovery</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Recover archived documents or permanently purge soft-deleted records
        </p>
      </div>

      {totalTrash === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <Trash2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-slate-900">Trash is empty</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No soft-deleted records exist in your company database.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Invoices Trash */}
          {invoices.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                <h2 className="text-sm font-semibold text-slate-900">Archived Invoices ({invoices.length})</h2>
              </div>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Invoice No</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right w-36">Total Amount</TableHead>
                        <TableHead className="text-right w-36">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-semibold text-slate-900">{inv.invoiceNo}</TableCell>
                          <TableCell className="font-medium text-slate-600 text-xs">{inv.client.name}</TableCell>
                          <TableCell className="text-right font-medium text-slate-900 tabular-nums">
                            {formatCurrency(inv.grandTotal.toNumber())}
                          </TableCell>
                          <TableCell className="text-right">
                            <InvoiceListActions invoiceId={inv.id} isTrashed />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Quotations Trash */}
          {quotations.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-semibold text-slate-900">Archived Quotations ({quotations.length})</h2>
              </div>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Quotation No</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right w-36">Total Amount</TableHead>
                        <TableHead className="text-right w-36">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotations.map((quo) => (
                        <TableRow key={quo.id}>
                          <TableCell className="font-semibold text-slate-900">{quo.quotationNo}</TableCell>
                          <TableCell className="font-medium text-slate-600 text-xs">{quo.client.name}</TableCell>
                          <TableCell className="text-right font-medium text-slate-900 tabular-nums">
                            {formatCurrency(quo.grandTotal.toNumber())}
                          </TableCell>
                          <TableCell className="text-right">
                            <QuotationListActions quotationId={quo.id} isTrashed />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Purchases Trash */}
          {purchases.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-semibold text-slate-900">Archived Purchases ({purchases.length})</h2>
              </div>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-44">Purchase No</TableHead>
                        <TableHead className="text-right w-36">Total Value</TableHead>
                        <TableHead className="text-right w-36">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((pur) => (
                        <TableRow key={pur.id}>
                          <TableCell className="font-semibold text-slate-900">{pur.purchaseNo}</TableCell>
                          <TableCell className="text-right font-medium text-slate-900 tabular-nums">
                            {formatCurrency(pur.grandTotal.toNumber())}
                          </TableCell>
                          <TableCell className="text-right">
                            <PurchaseListActions purchaseId={pur.id} isTrashed />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
