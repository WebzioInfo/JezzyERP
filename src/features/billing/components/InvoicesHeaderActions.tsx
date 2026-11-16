"use client";

import React, { useState } from "react";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/core/Button";
import { BulkExportModal } from "./BulkExportModal";

export function InvoicesHeaderActions() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2.5">
        <Button
          variant="outline"
          size="md"
          onClick={() => setIsExportModalOpen(true)}
        >
          <Download className="w-4 h-4 mr-1.5 text-slate-500" />
          Bulk Export
        </Button>

        <Link href="/invoices/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1" />
            New Invoice
          </Button>
        </Link>
      </div>

      <BulkExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
}
