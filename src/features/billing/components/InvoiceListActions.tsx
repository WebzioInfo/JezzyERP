"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
  XCircle
} from "lucide-react";
import { Button } from "@/ui/core/Button";
import { deleteInvoiceAction, restoreInvoiceAction, permanentlyDeleteInvoiceAction } from "@/features/billing/actions/billing";
import { useToast } from "@/context/ToastContext";

interface InvoiceListActionsProps {
  invoiceId: string;
  isTrashed?: boolean;
}

export function InvoiceListActions({ invoiceId, isTrashed = false }: InvoiceListActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { success, error } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/invoices/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Extract filename from Content-Disposition header
      const disposition = response.headers.get("Content-Disposition");
      let filename = `Invoice_${invoiceId}.pdf`;
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      success("Invoice downloaded successfully.");
    } catch (err) {
      error("Failed to download invoice.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const res = isTrashed
        ? await permanentlyDeleteInvoiceAction(invoiceId)
        : await deleteInvoiceAction(invoiceId);

      if (res && 'error' in res) {
        error(res.error || "Failed to delete invoice.");
      } else {
        success(isTrashed ? "Invoice permanently deleted." : "Invoice moved to trash.");
        setShowConfirm(false);
      }
    } catch (err) {
      error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const res = await restoreInvoiceAction(invoiceId);
      if (res && 'error' in res) {
        error(res.error || "Failed to restore invoice.");
      } else {
        success("Invoice restored successfully.");
      }
    } catch (err) {
      error("An unexpected error occurred.");
    } finally {
      setIsRestoring(false);
    }
  };

  if (isTrashed) {
    return (
      <div className="flex items-center justify-end gap-2">
        {!showConfirm ? (
          <>
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

            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-xl hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600"
              onClick={handleRestore}
              disabled={isRestoring}
              title="Restore Invoice"
            >
              {isRestoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600"
              onClick={() => setShowConfirm(true)}
              disabled={isDeleting}
              title="Permanently Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-1 animate-in slide-in-from-right-2 duration-300">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
            >
              No
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="h-8 px-4 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-red-500/20"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Purge"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {!showConfirm ? (
        <>
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
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            title="Move to Trash"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <div className="flex items-center gap-1 animate-in slide-in-from-right-2 duration-300">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="h-8 px-4 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-red-500/20"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete"}
          </Button>
        </div>
      )}
    </div>
  );
}
