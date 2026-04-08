"use client";

import React, { useState, useTransition } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/ui/core/Table";
import { Mail, Trash2, Loader2, Search, Building2, UserMinus, AlertTriangle, Edit3, MapPin, Phone, ShieldCheck, X, Hash } from "lucide-react";
import { Button } from "@/ui/core/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/ui/core/Card";
import { Input } from "@/ui/core/Input";
import { deleteClientAction } from "@/features/clients/actions/clientActions";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { ClientForm } from "./ClientForm";

import type { Client } from "@/features/clients/types";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

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
        <TableRow className={`group animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both transition-all`}>
            <TableCell className="py-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:shadow-md group-hover:scale-105 transition-all">
                        <Building2 className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight truncate">{client.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Corporate ID: {client.id.slice(-8)}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1.5">
                    {client.email ? (
                        <span className="flex items-center gap-2 text-[13px] text-slate-600 font-bold group-hover:text-slate-900 transition-colors">
                            <Mail className="h-3.5 w-3.5 text-primary-400" /> {client.email}
                        </span>
                    ) : (
                        <span className="text-slate-300 italic text-[10px] font-black uppercase tracking-[0.2em]">Private Entry</span>
                    )}
                    {client.phone && (
                        <span className="flex items-center gap-2 text-[11px] text-slate-400 font-black tracking-widest">
                            <Phone className="h-3 w-3" /> {client.phone}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-2">
                    {client.gst ? (
                        <span className="inline-flex px-2 py-0.5 rounded-lg bg-slate-900 text-white font-mono text-[10px] font-black tracking-[0.15em] shadow-lg shadow-slate-900/10">
                            {client.gst}
                        </span>
                    ) : (
                        <span className="text-slate-200 italic text-xs tracking-widest">NO GSTIN</span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start gap-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary-50 text-primary-700 border border-primary-100 italic shadow-sm shadow-primary-500/5">
                        {client.state}
                    </span>
                    {client.pinCode && (
                        <span className="text-[10px] font-bold text-slate-400 ml-1 tracking-[0.2em]">PIN {client.pinCode}</span>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-right pr-8">
                <div className="flex items-center justify-end gap-2">
                    {!showConfirm ? (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(client)}
                                className="h-9 w-9 p-0 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl"
                            >
                                <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowConfirm(true)}
                                className="h-9 w-9 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-red-50 rounded-lg mr-2 border border-red-100">
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Confirm?</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 rounded-lg text-[10px] font-black uppercase"
                                onClick={() => setShowConfirm(false)}
                                disabled={isPending}
                            >
                                No
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                className="h-8 px-4 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-red-500/20"
                                onClick={handleDelete}
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "YES"}
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
        <div className="clay-card p-6 space-y-5 animate-in fade-in zoom-in duration-500 fill-mode-both border-0">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                        <Building2 className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-slate-900 uppercase tracking-tight">{client.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            {client.gst && (
                                <span className="bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest">
                                    {client.gst}
                                </span>
                            )}
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{client.state}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(client)} className="h-9 w-9 rounded-xl text-slate-400">
                        <Edit3 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowConfirm(true)} className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4">
                {client.email && (
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-primary-400" /> {client.email}
                    </div>
                )}
                {client.phone && (
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-primary-400" /> {client.phone}
                    </div>
                )}
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-primary-400" />
                    <span className="truncate">{client.address1} {client.pinCode && `, ${client.pinCode}`}</span>
                </div>
            </div>

            {showConfirm && (
                <div className="flex items-center justify-between gap-4 p-3 bg-red-50 rounded-2xl animate-reveal">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Delete client?</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)} className="text-[10px] font-black">NO</Button>
                        <Button variant="danger" size="sm" onClick={handleDelete} loading={isPending} className="text-[10px] font-black px-4">YES</Button>
                    </div>
                </div>
            )}
        </div>
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
        <div className="space-y-10">
            {/* Unified Modal Overlay */}
            {(editingClient || isAdding) && (
                <div className="fixed inset-0 z-100 h-full flex p-10 items-center justify-center bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="w-full max-w-4xl h-full overflow-y-auto">
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
                    </div>
                </div>
            )}

            <Card className="p-6 shadow-none bg-transparent overflow-hidden rounded-3xl">
                <CardHeader className="flex flex-col lg:flex-row items-center justify-between gap-8 px-0 py-6">
                    <div className="text-center lg:text-left">
                        <CardTitle className="text-4xl font-black text-slate-900 font-display italic tracking-tight">Corporate Directory</CardTitle>
                        <CardDescription className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.3em] italic">High-value client records & master identifiers</CardDescription>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-max">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <Input
                                placeholder="Search repository..."
                                className="pl-14 h-16 w-full"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full md:w-max h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            <Building2 className="w-5 h-5" />
                            <span>Add Client</span>
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ErrorBoundary name="Client Directory">
                        {clients.length === 0 ? (
                            <div className="py-32 text-center clay-card animate-in fade-in zoom-in duration-700 bg-white">
                                <div className="mx-auto w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
                                    <UserMinus className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-black text-2xl font-display uppercase italic tracking-tighter">Directory is empty</h3>
                                <p className="text-sm font-bold text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed uppercase tracking-widest opacity-60">
                                    No corporate records match your current criteria.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden lg:block clay-card overflow-hidden border-0 bg-white">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                                            <TableRow>
                                                <TableHead className="w-[30%] px-8 text-[10px] font-black uppercase tracking-[0.25em] italic">Legal Identity</TableHead>
                                                <TableHead className="w-[30%] text-[10px] font-black uppercase tracking-[0.25em] italic">Communications</TableHead>
                                                <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-[0.25em] italic">Tax Code</TableHead>
                                                <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-[0.25em] italic">Location</TableHead>
                                                <TableHead className="w-[10%] text-right px-8 text-[10px] font-black uppercase tracking-[0.25em] italic">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {clients.map((client, idx) => (
                                                <ClientTableRow
                                                    key={client.id}
                                                    client={client}
                                                    onEdit={setEditingClient}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Grid View */}
                                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                    {clients.map((client, idx) => (
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
                </CardContent>
            </Card>
        </div>
    );
}

