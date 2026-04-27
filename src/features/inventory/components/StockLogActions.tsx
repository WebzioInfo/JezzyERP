"use client";

import React, { useState } from "react";
import { Trash2, Edit2, Loader2, X, Check } from "lucide-react";
import { Button } from "@/ui/core/Button";
import { deleteStockLogAction, updateStockLogAction } from "../actions/stockActions";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/ui/core/Modal";
import { Input } from "@/ui/core/Input";

interface StockLogActionsProps {
    logId: string;
    currentQuantity: number;
    currentNotes: string | null;
}

export function StockLogActions({ logId, currentQuantity, currentNotes }: StockLogActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const [editQty, setEditQty] = useState(currentQuantity.toString());
    const [editNotes, setEditNotes] = useState(currentNotes || "");

    const { success, error } = useToast();

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await deleteStockLogAction(logId);
        if (res.success) {
            success("Stock entry deleted and inventory adjusted.");
            setShowDeleteConfirm(false);
        } else {
            error(res.error || "Failed to delete entry.");
        }
        setIsDeleting(false);
    };

    const handleUpdate = async () => {
        setIsPending(true);
        const res = await updateStockLogAction(logId, parseFloat(editQty), editNotes);
        if (res.success) {
            success("Stock entry updated and inventory adjusted.");
            setIsEditing(false);
        } else {
            error(res.error || "Failed to update entry.");
        }
        setIsPending(false);
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => setIsEditing(true)}
            >
                <Edit2 size={14} />
            </Button>
            
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                onClick={() => setShowDeleteConfirm(true)}
            >
                <Trash2 size={14} />
            </Button>

            {/* Edit Modal */}
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
                <div className="p-8 space-y-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase italic">Edit Stock Entry</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Modifying log ID: {logId.slice(-6)}</p>
                    </div>

                    <div className="space-y-4">
                        <Input 
                            label="Quantity Delta"
                            type="number"
                            step="0.001"
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notes</label>
                            <textarea 
                                className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary-500/10 transition-all outline-hidden resize-none"
                                rows={3}
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button 
                            variant="secondary" 
                            className="flex-1 italic" 
                            onClick={() => setIsEditing(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="flex-1 italic gap-2" 
                            onClick={handleUpdate}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            Update Entry
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <div className="p-8 space-y-6 text-center">
                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase italic">Confirm Deletion</h3>
                        <p className="text-sm font-medium text-slate-500 mt-2">
                            This will permanently remove this log entry and <span className="font-bold text-rose-600">reverse its impact</span> on the current stock level.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button 
                            variant="secondary" 
                            className="flex-1 italic" 
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                        >
                            No, Keep it
                        </Button>
                        <Button 
                            variant="danger"
                            className="flex-1 italic gap-2" 
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            Yes, Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
