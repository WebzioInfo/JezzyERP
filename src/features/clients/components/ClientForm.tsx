"use client";

import { useClientForm } from "../hooks/useClientForm";
import { Input } from "@/ui/core/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/core/Card";
import { Building2, UserPlus, ShieldCheck, Mail, Phone, MapPin, Hash, Save, X } from "lucide-react";
import { StateSelect } from "@/components/forms/StateSelect";

interface ClientFormProps {
    client?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
    const { formAction, pending, isEdit } = useClientForm(client, onSuccess);

    return (
        <Card className="overflow-hidden group shadow-2xl animate-reveal custom-scrollbar">
            <CardHeader className="bg-slate-900 px-10 py-10 group-hover:bg-slate-800 transition-colors">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                            {isEdit ? <Save className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
                        </div>
                        <div>
                            <CardTitle className="text-white text-3xl font-black italic tracking-tighter font-display">
                                {isEdit ? 'Corporate Profile Update' : 'New Client Onboarding'}
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-sm font-medium mt-1">
                                {isEdit ? `Modifying repository data for ${client.name}` : 'Establish a new business relationship in the ERP directory'}
                            </CardDescription>
                        </div>
                    </div>
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-12 lg:p-16">
                <form id="client-form" action={formAction} className="space-y-12">
                    <div className="space-y-12">
                        {/* ── SECTION: LEGAL IDENTITY ── */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
                                    <Building2 size={16} className="text-primary-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Legal Identity & Taxation</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Full Registered Company Name"
                                        name="name"
                                        defaultValue={client?.name}
                                        placeholder="e.g. Acme Enterprises Private Limited"
                                        icon={<Building2 size={20} />}
                                        required
                                    />
                                </div>
                                <Input
                                    label="GST Registration Number (GSTIN)"
                                    name="gst"
                                    defaultValue={client?.gst}
                                    placeholder="29AAAAA0000A1Z5"
                                    icon={<ShieldCheck size={20} />}
                                    className="font-mono uppercase tracking-widest"
                                />
                                <StateSelect
                                    label="Registered State / Territory"
                                    name="state"
                                    defaultValue={client?.state}
                                    required
                                />
                            </div>
                        </div>

                        {/* ── SECTION: CONTACT CHANNELS ── */}
                        <div className="space-y-8 pt-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <Mail size={16} className="text-emerald-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Communication Channels</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <Input
                                    label="Accounting / Billing Email"
                                    name="email"
                                    type="email"
                                    defaultValue={client?.email}
                                    placeholder="finance@clientdomain.com"
                                    icon={<Mail size={20} />}
                                />
                                <Input
                                    label="Primary Contact Number"
                                    name="phone"
                                    type="tel"
                                    defaultValue={client?.phone}
                                    placeholder="+91 00000 00000"
                                    icon={<Phone size={20} />}
                                />
                            </div>
                        </div>

                        {/* ── SECTION: PHYSICAL ADDRESS ── */}
                        <div className="space-y-8 pt-10 ">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <MapPin size={16} className="text-amber-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Registered Office Location</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 ml-1">Address Line 1</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary-500 transition-colors">
                                            <MapPin size={20} />
                                        </div>
                                        <textarea
                                            name="address1"
                                            defaultValue={client?.address1}
                                            rows={2}
                                            className="flex w-full rounded-2xl bg-slate-50/50 pl-14 pr-6 py-5 text-base clay-inner transition-all placeholder:text-slate-300 focus:ring-4 focus:ring-primary-500/10 focus:outline-none focus:bg-white hover:bg-slate-50 resize-none font-semibold text-slate-900"
                                            placeholder="Floor, Building Name, Street Address"
                                            required
                                        />
                                    </div>
                                </div>
                                <Input
                                    label="Postal Pin Code"
                                    name="pinCode"
                                    defaultValue={client?.pinCode}
                                    placeholder="560001"
                                    icon={<Hash size={20} />}
                                    maxLength={6}
                                    className="font-mono"
                                />
                                <div className="md:col-span-3">
                                    <Input
                                        label="Address Line 2 (Optional)"
                                        name="address2"
                                        defaultValue={client?.address2}
                                        placeholder="Landmark, Area, Secondary Locality"
                                        icon={<MapPin size={20} />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12">
                        <button
                            type="submit"
                            disabled={pending}
                            className="w-full h-20 text-xl font-black gap-4 rounded-3xl shadow-2xl transition-all uppercase italic tracking-widest flex items-center justify-center bg-primary-600 text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {pending ? (
                                <div className="w-8 h-8 rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isEdit ? <Save className="w-7 h-7" /> : <UserPlus className="w-7 h-7" />}
                                    <span>{isEdit ? 'Push Data Updates' : 'Initialize Client Profile'}</span>
                                </>
                            )}
                        </button>

                        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.4em] mt-10 opacity-50 italic">
                            Authorization Protocol 4.2 // Secure Directory Entry
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

