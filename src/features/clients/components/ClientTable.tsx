"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/ui/core/Table";
import { Mail, Trash2, Loader2, Search, Building2, UserMinus, AlertTriangle, Edit3, MapPin, Phone, Plus, X } from "lucide-react";
import { Button } from "@/ui/core/Button";
import { Card, CardContent } from "@/ui/core/Card";
import { deleteClientAction } from "@/features/clients/actions/clientActions";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { ClientForm } from "./ClientForm";

import type { Client } from "@/features/clients/types";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Modal } from "@/ui/core/Modal";

interface ClientTableProps {
    clients: Client[];
}

const ClientTableRow = ({ client, onEdit }: { client: Client, onEdit: (client: Client) => void }) => {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);
    const { success, error } = useToast();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteClientAction(client.id);
            if (res && 'success' in res) {
                success("Client removed from directory successfully.");
                setShowConfirm(false);
            } else if (res && 'error' in res) {
                error(res.error || "Failed to delete client.");
            } else {
                error("Failed to delete client.");
            }
        });
    };

    return (
        <TableRow className="group">
            <TableCell className="py-3.5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <Link href={`/clients/${client.id}`} className="hover:underline font-semibold text-slate-900 block truncate">
                            {client.name}
                        </Link>
                        <p className="text-[11px] text-slate-400">ID: {client.id.slice(-6)}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-0.5 text-xs">
                    {client.email ? (
                        <span className="flex items-center gap-1.5 text-slate-700 truncate">
                            <Mail className="h-3 w-3 text-slate-400 shrink-0" /> {client.email}
                        </span>
                    ) : (
                        <span className="text-slate-400 italic text-[11px]">No email</span>
                    )}
                    {client.phone && (
                        <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="h-3 w-3 text-slate-400 shrink-0" /> {client.phone}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                {client.gst ? (
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-xs font-medium">
                        {client.gst}
                    </span>
                ) : (
                    <span className="text-slate-400 text-xs">Unregistered</span>
                )}
            </TableCell>
            <TableCell className="text-slate-600 text-xs">
                <span className="truncate block max-w-xs">{client.state || client.address1 || "—"}</span>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    {!showConfirm ? (
                        <>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onEdit(client)}
                                title="Edit client"
                                aria-label={`Edit ${client.name}`}
                                className="h-8 w-8 text-slate-400 hover:text-slate-700"
                            >
                                <Edit3 size={15} />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setShowConfirm(true)}
                                title="Delete client"
                                aria-label={`Delete ${client.name}`}
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 size={15} />
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-1.5 animate-in fade-in">
                            <span className="text-xs text-red-600 font-medium mr-1">Delete?</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setShowConfirm(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                onClick={handleDelete}
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete"}
                            </Button>
                        </div>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
};

const ClientMobileCard = ({ client, onEdit }: { client: Client, onEdit: (client: Client) => void }) => {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);
    const { success, error } = useToast();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteClientAction(client.id);
            if (res && 'success' in res) {
                success("Client removed successfully.");
                setShowConfirm(false);
            } else {
                error("Removal failed.");
            }
        });
    };

    return (
        <Card className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <Link href={`/clients/${client.id}`} className="hover:underline block font-semibold text-sm text-slate-900 truncate">
                            {client.name}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {client.gst && (
                                <span className="bg-slate-100 text-slate-800 text-[10px] font-mono px-1.5 py-0.2 rounded font-medium">
                                    {client.gst}
                                </span>
                            )}
                            <span className="text-[11px] text-slate-400">{client.state}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(client)} className="h-8 w-8 text-slate-400 hover:text-slate-700">
                        <Edit3 size={15} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowConfirm(true)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 size={15} />
                    </Button>
                </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                {client.email && (
                    <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.email}</span>
                    </div>
                )}
                {client.phone && (
                    <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{client.phone}</span>
                    </div>
                )}
                {client.address1 && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.address1}{client.pinCode ? `, ${client.pinCode}` : ''}</span>
                    </div>
                )}
            </div>

            {showConfirm && (
                <div className="flex items-center justify-between gap-3 p-2.5 bg-red-50 rounded-lg border border-red-200 animate-in fade-in">
                    <span className="text-xs text-red-700 font-medium">Delete client?</span>
                    <div className="flex gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)} className="h-7 px-2 text-xs">Cancel</Button>
                        <Button variant="danger" size="sm" onClick={handleDelete} loading={isPending} className="h-7 px-2.5 text-xs">Delete</Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export function ClientTable({ clients }: ClientTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            {/* Modal for adding/editing client */}
            <Modal
                isOpen={!!editingClient || isAdding}
                onClose={() => {
                    setEditingClient(null);
                    setIsAdding(false);
                }}
                title={editingClient ? "Edit Client" : "Add New Client"}
            >
                <ClientForm
                    client={editingClient || undefined}
                    onSuccess={() => {
                        setEditingClient(null);
                        setIsAdding(false);
                    }}
                    onCancel={() => {
                        setEditingClient(null);
                        setIsAdding(false);
                    }}
                />
            </Modal>

            {/* Page Header & Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Clients</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage customer directory, contact details, and tax profiles</p>
                </div>

                <Button
                    onClick={() => setIsAdding(true)}
                    variant="primary"
                    size="md"
                >
                    <Plus className="w-4 h-4 mr-1.5" />
                    <span>Add Client</span>
                </Button>
            </div>

            {/* Search Filter Bar */}
            <Card>
                <CardContent className="p-3.5">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by client name, email, or GSTIN..."
                            className="w-full h-9 pl-9 pr-8 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-colors"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => handleSearch("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Table Listing */}
            <ErrorBoundary name="Client Directory">
                {clients.length === 0 ? (
                    <Card className="py-16 text-center p-4">
                        <div className="mx-auto w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                            <UserMinus className="h-5 w-5" />
                        </div>
                        <h3 className="text-slate-900 font-semibold text-sm">No clients found</h3>
                        <p className="text-xs text-slate-500 mt-0.5 mb-5 max-w-sm mx-auto">
                            {searchTerm ? "No clients match your search query." : "Start by adding your first client to the directory."}
                        </p>
                        <Button variant="primary" size="md" onClick={() => setIsAdding(true)}>
                            <Plus className="w-4 h-4 mr-1.5" />
                            Add Client
                        </Button>
                    </Card>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <Card className="hidden lg:block overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[30%]">Client / Entity</TableHead>
                                        <TableHead className="w-[28%]">Contact Info</TableHead>
                                        <TableHead className="w-[18%]">GSTIN</TableHead>
                                        <TableHead className="w-[14%]">State / Location</TableHead>
                                        <TableHead className="w-[10%] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.map((client) => (
                                        <ClientTableRow
                                            key={client.id}
                                            client={client}
                                            onEdit={setEditingClient}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        {/* Mobile Card View */}
                        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {clients.map((client) => (
                                <ClientMobileCard
                                    key={client.id}
                                    client={client}
                                    onEdit={setEditingClient}
                                />
                            ))}
                        </div>
                    </>
                )}
            </ErrorBoundary>
        </div>
    );
}
