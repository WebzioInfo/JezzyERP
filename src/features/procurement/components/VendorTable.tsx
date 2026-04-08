"use client";

import { useState } from "react";
import { 
    Search, 
    MoreVertical, 
    Trash2, 
    Edit2, 
    Building2, 
    Plus,
    Filter,
    ShieldCheck,
    Globe,
    Phone,
    Mail
} from "lucide-react";
import { deleteVendorAction } from "../actions";
import { VendorForm } from "./VendorForm";
import { cn } from "@/utils";

interface VendorTableProps {
    vendors: any[];
}

export function VendorTable({ vendors }: VendorTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<any>(null);

    const filtered = vendors.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.gst?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (vendor: any) => {
        setEditingVendor(vendor);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingVendor(null);
    };

    return (
        <div className="space-y-10 animate-fade-in custom-scrollbar">
            {/* Header + Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/40 p-8 rounded-[2.5rem] border border-white/50 backdrop-blur-xl">
                <div className="flex-1 max-w-md relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search supplier directory / GST endpoints..."
                        className="w-full bg-white/80 h-16 pl-14 pr-6 rounded-2xl border-none clay-inner focus:ring-4 focus:ring-primary-500/10 focus:bg-white text-base font-semibold text-slate-900 transition-all placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-4">
                    <button className="h-16 w-16 flex items-center justify-center clay-btn bg-white rounded-2xl text-slate-400 hover:text-primary-600 transition-all">
                        <Filter size={20} />
                    </button>
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="h-16 px-8 flex items-center gap-4 clay-btn bg-primary-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary-500/20"
                    >
                        <Plus size={20} />
                        <span>Add Supplier</span>
                    </button>
                </div>
            </div>

            {/* Form Overlay */}
            {isFormOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center sm:p-6 lg:p-20 overflow-y-auto custom-scrollbar">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={handleCloseForm} />
                    <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] scrollbar-hide">
                        <VendorForm 
                            vendor={editingVendor} 
                            onCancel={handleCloseForm}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </div>
            )}

            {/* Table Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map((vendor) => (
                    <div key={vendor.id} className="group relative bg-white rounded-[2.5rem] border border-slate-200/50 p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-primary-100 hover:-translate-y-2">
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-all duration-500 overflow-hidden shadow-inner">
                                <Building2 className="w-7 h-7 text-slate-400 group-hover:text-primary-600 group-hover:scale-110 transition-all" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                                <button 
                                    onClick={() => handleEdit(vendor)}
                                    className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 border border-slate-100 transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => deleteVendorAction(vendor.id)}
                                    className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 border border-slate-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter truncate leading-tight italic uppercase group-hover:text-primary-600 transition-colors">{vendor.name}</h3>
                            
                            <div className="flex flex-wrap gap-2">
                                {vendor.gst ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        <ShieldCheck size={12} /> GST Verified: {vendor.gst}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-widest border border-orange-100">
                                        No Tax Identity
                                    </span>
                                )}
                            </div>

                            <div className="pt-6 space-y-3.5 border-t border-slate-50">
                                <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                                    <Mail size={16} />
                                    <span className="text-xs font-bold truncate">{vendor.email || 'No Email Registered'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                                    <Phone size={16} />
                                    <span className="text-xs font-bold">{vendor.phone || 'No Contact Number'}</span>
                                </div>
                                <div className="flex items-start gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                                    <Globe className="w-4 h-4 mt-0.5" />
                                    <p className="text-xs font-bold leading-relaxed line-clamp-2 italic">
                                        {vendor.address1}, {vendor.state}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-32 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border border-slate-100 mb-8 border-dashed">
                             <Building2 className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">No Suppliers Found</h4>
                        <p className="text-slate-400 mt-2 font-medium max-w-xs leading-relaxed italic uppercase text-[10px] tracking-[0.2em]">The procurement directory is currently empty. Initialize a new business relationship to begin inward billing.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
