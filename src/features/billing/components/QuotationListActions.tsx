"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Edit, 
  Trash2, 
  ExternalLink,
  Loader2,
  RefreshCw,
  XCircle
} from "lucide-react";
import { Button } from "@/ui/core/Button";
import { deleteQuotationAction, restoreQuotationAction, permanentlyDeleteQuotationAction } from "@/features/billing/actions/quotations";
import { useToast } from "@/context/ToastContext";

interface QuotationListActionsProps {
  quotationId: string;
  isTrashed?: boolean;
}

export function QuotationListActions({ quotationId, isTrashed = false }: QuotationListActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { success, error } = useToast();

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const res = isTrashed 
        ? await permanentlyDeleteQuotationAction(quotationId)
        : await deleteQuotationAction(quotationId);

      if (res && 'error' in res) {
        error(res.error || "Failed to delete proposal.");
      } else {
        success(isTrashed ? "Proposal permanently deleted." : "Proposal moved to trash.");
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
      const res = await restoreQuotationAction(quotationId);
      if (res && 'error' in res) {
        error(res.error || "Failed to restore proposal.");
      } else {
        success("Proposal restored successfully.");
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
            <Link href={`/quotations/${quotationId}`}>
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
              title="Restore Proposal"
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
          <Link href={`/quotations/${quotationId}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900"
              title="View Details"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>

          <Link href={`/quotations/${quotationId}/edit`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 rounded-xl hover:bg-primary-50 text-slate-400 hover:text-primary-600"
              title="Edit Proposal"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600"
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            title="Delete Proposal"
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
