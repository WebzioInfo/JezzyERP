"use client";

import { useState } from "react";
import { 
    Search, 
    Trash2, 
    Edit2, 
    Building2, 
    Plus, 
    ShieldCheck, 
    Globe, 
    Phone, 
    Mail,
    X,
    Building
} from "lucide-react";
import { deleteVendorAction } from "../actions";
import { VendorForm } from "./VendorForm";
import { Modal } from "@/ui/core/Modal";
import { Button } from "@/ui/core/Button";
import { Card, CardContent } from "@/ui/core/Card";

interface VendorTableProps {
    vendors: any[];
}

export function VendorTable({ vendors }: VendorTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<any>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const filtered = vendors.filter(v => 
        v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.gst?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (vendor: any) => {
        setEditingVendor(vendor);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingVendor(null);
    };

    const handleDelete = async (id: string) => {
        await deleteVendorAction(id);
        setConfirmDeleteId(null);
    };

    return (
        <div className="space-y-4">
            {/* Header Actions & Search Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Vendors & Suppliers</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage supplier contact profiles, GST records, and purchase directories</p>
                </div>

                <Button 
                    onClick={() => setIsFormOpen(true)}
                    variant="primary"
                    size="md"
                >
                    <Plus size={16} className="mr-1.5" />
                    <span>Add Supplier</span>
                </Button>
            </div>

            {/* Search Filter */}
            <Card>
                <CardContent className="p-3.5">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search suppliers by name, GSTIN, or email..."
                            className="w-full h-9 pl-9 pr-8 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Vendor Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                title={editingVendor ? "Edit Supplier" : "Add Supplier"}
                maxWidth="max-w-2xl"
            >
                <VendorForm 
                    vendor={editingVendor} 
                    onCancel={handleCloseForm}
                    onSuccess={handleCloseForm}
                />
            </Modal>

            {/* Supplier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filtered.map((vendor) => (
                    <Card key={vendor.id} className="p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-slate-900 truncate leading-snug">{vendor.name}</h3>
                                        <p className="text-[11px] text-slate-400 truncate">ID: {vendor.id.slice(-6)}</p>
                                    </div>
                                </div>

                                {/* Accessible Action Buttons */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(vendor)}
                                        aria-label={`Edit ${vendor.name}`}
                                        className="h-8 w-8 text-slate-400 hover:text-slate-700"
                                    >
                                        <Edit2 size={14} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setConfirmDeleteId(vendor.id)}
                                        aria-label={`Delete ${vendor.name}`}
                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>

                            {/* Tax Badge */}
                            <div className="mb-3">
                                {vendor.gst ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-mono font-medium border border-emerald-200">
                                        <ShieldCheck size={12} /> GST: {vendor.gst}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs">
                                        Unregistered Taxpayer
                                    </span>
                                )}
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Mail size={13} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{vendor.email || 'No email provided'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Phone size={13} className="text-slate-400 shrink-0" />
                                    <span>{vendor.phone || 'No phone recorded'}</span>
                                </div>
                                {vendor.address1 && (
                                    <div className="flex items-start gap-2 text-slate-500">
                                        <Globe size={13} className="text-slate-400 shrink-0 mt-0.5" />
                                        <span className="truncate">{vendor.address1}{vendor.state ? `, ${vendor.state}` : ''}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inline Delete Confirmation */}
                        {confirmDeleteId === vendor.id && (
                            <div className="mt-3 pt-3 border-t border-red-100 flex items-center justify-between gap-2 bg-red-50/50 p-2 rounded-lg">
                                <span className="text-xs text-red-700 font-medium">Delete supplier?</span>
                                <div className="flex gap-1.5">
                                    <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)} className="h-7 px-2 text-xs">
                                        Cancel
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(vendor.id)} className="h-7 px-2.5 text-xs">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full">
                        <Card className="text-center py-16 p-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                                 <Building className="w-5 h-5" />
                            </div>
                            <h4 className="text-slate-900 font-semibold text-sm">No suppliers found</h4>
                            <p className="text-xs text-slate-500 mt-0.5 mb-5 max-w-sm mx-auto">
                                {searchTerm ? "No suppliers match your current query." : "Add suppliers to track purchases and incoming vendor bills."}
                            </p>
                            <Button variant="primary" size="md" onClick={() => setIsFormOpen(true)}>
                                <Plus size={16} className="mr-1.5" />
                                Add Supplier
                            </Button>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
