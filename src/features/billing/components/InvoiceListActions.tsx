"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Download, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "@/ui/core/Button";
import { deleteInvoiceAction } from "@/features/billing/actions/billing";
import { useToast } from "@/context/ToastContext";

interface InvoiceListActionsProps {
  invoiceId: string;
}

export function InvoiceListActions({ invoiceId }: InvoiceListActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { success, error } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/invoices/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoiceId }),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      success("Invoice downloaded successfully.");
    } catch (err) {
      error("Failed to download invoice.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteInvoiceAction(invoiceId);
      if (res && 'error' in res) {
        error(res.error || "Failed to delete invoice.");
      } else {
        success("Invoice deleted successfully.");
      }
    } catch (err) {
      error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/invoices/${invoiceId}`}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900"
          title="View Details"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </Link>

      <Link href={`/invoices/${invoiceId}/edit`}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0 rounded-xl hover:bg-primary-50 text-slate-400 hover:text-primary-600"
          title="Edit Invoice"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </Link>

      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 w-9 p-0 rounded-xl hover:bg-emerald-50 text-slate-400 hover:text-emerald-600"
        onClick={handleDownload}
        disabled={isDownloading}
        title="Download PDF"
      >
        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600"
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete Invoice"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}
