"use client";

import { useActionState } from "react";
import { createProductAction, updateProductAction } from "@/features/inventory/actions/productActions";
import { Input } from "@/ui/core/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/core/Card";
import { PackagePlus, Tag, Landmark, IndianRupee, Layers, Save, X, Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface ProductFormProps {
    product?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
    const { success, error } = useToast();
    const isEdit = !!product;

    const [state, formAction, pending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const res: any = isEdit
                ? await updateProductAction(product.id, formData)
                : await createProductAction(formData);

            if (res && 'error' in res) {
                error(res.error || `Failed to ${isEdit ? 'update' : 'catalog'} item.`);
                return { error: res.error };
            }
            if (res && 'success' in res) {
                success(isEdit ? "Catalog item updated." : "New item successfully added to inventory catalog.");
                if (onSuccess) onSuccess();
                const form = document.getElementById("product-form") as HTMLFormElement;
                form?.reset();
                return { success: true };
            }
            return prevState;
        },
        null
    );

    return (
        <Card className="border-0 overflow-hidden group shadow-2xl">
            <CardHeader className="bg-slate-900 px-10 py-10 border-b border-white/10 group-hover:bg-slate-800 transition-colors">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-inner">
                            {isEdit ? <Save className="w-8 h-8 text-white" /> : <PackagePlus className="w-8 h-8 text-white" />}
                        </div>
                        <div>
                            <CardTitle className="text-white text-3xl font-black italic tracking-tighter font-display">
                                {isEdit ? 'Update Item' : 'Catalog New Item'}
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-sm font-medium mt-1">
                                {isEdit ? `Modifying specifications for ${product.description}` : 'Register a new product or service in the master catalog'}
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
                <form id="product-form" action={formAction} className="space-y-12">
                    <div className="space-y-12">
                        {/* ── SECTION: PRODUCT IDENTITY ── */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
                                    <Sparkles size={16} className="text-primary-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Product Specifications</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Item Description / Service Name"
                                        name="description"
                                        defaultValue={product?.description}
                                        placeholder="e.g. Industrial Water Purifier System"
                                        icon={<Tag size={20} />}
                                        required
                                    />
                                </div>
                                <Input
                                    label="Internal SKU / Reference Code (Optional)"
                                    name="sku"
                                    defaultValue={product?.sku}
                                    placeholder="ESS-PRD-001"
                                    icon={<Tag size={20} />}
                                    className="font-mono uppercase tracking-widest"
                                />
                                <Input
                                    label="HSN / SAC Code (Optional)"
                                    name="hsn"
                                    defaultValue={product?.hsn}
                                    placeholder="998311"
                                    icon={<Landmark size={20} />}
                                    className="font-mono tracking-widest"
                                />
                            </div>
                        </div>

                        {/* ── SECTION: PRICING & TAX ── */}
                        <div className="space-y-8 pt-10 border-t border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <IndianRupee size={16} className="text-emerald-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Financial Configuration</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="space-y-2">
                                    <Input
                                        label="Purchase Price (₹)"
                                        name="purchaseRate"
                                        type="number"
                                        step="0.01"
                                        defaultValue={product?.purchaseRate}
                                        placeholder="0.00"
                                        icon={<Landmark size={20} />}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        label="Selling Price (₹)"
                                        name="sellingRate"
                                        type="number"
                                        step="0.01"
                                        defaultValue={product?.sellingRate}
                                        placeholder="0.00"
                                        icon={<IndianRupee size={20} />}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Quantity Unit</label>
                                    <select
                                        name="unit"
                                        defaultValue={product?.unit || "NOS"}
                                        className="flex h-14 w-full rounded-2xl border-0 bg-slate-100/50 px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 appearance-none font-bold italic"
                                    >
                                        <option value="NOS">NOS (Numbers)</option>
                                        <option value="KGS">KGS (Kilograms)</option>
                                        <option value="PCS">PCS (Pieces)</option>
                                        <option value="BOX">BOX</option>
                                        <option value="MTR">MTR (Meters)</option>
                                        <option value="PKT">PKT (Packets)</option>
                                        <option value="SET">SET</option>
                                        <option value="UNT">UNT (Units)</option>
                                        <option value="DRM">DRM (Drums)</option>
                                        <option value="BAG">BAG</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">GST Rate (%)</label>
                                    <select
                                        name="gstRate"
                                        defaultValue={product?.gstRate || 18}
                                        className="flex h-14 w-full rounded-2xl border-0 bg-slate-100/50 px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 appearance-none font-bold italic"
                                    >
                                        <option value="0">0%</option>
                                        <option value="5">5%</option>
                                        <option value="12">12%</option>
                                        <option value="18">18%</option>
                                        <option value="28">28%</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Kind of Pkgs (Default)</label>
                                    <select
                                        name="pkgType"
                                        defaultValue={product?.pkgType || "BOX"}
                                        className="flex h-14 w-full rounded-2xl border-0 bg-slate-100/50 px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 appearance-none font-bold italic uppercase"
                                    >
                                        <option value="BOX">BOX</option>
                                        <option value="BAG">BAG</option>
                                        <option value="PKT">PACKET</option>
                                        <option value="DRM">DRUM</option>
                                        <option value="PCS">PIECES</option>
                                        <option value="NOS">NOS</option>
                                        <option value="ROLL">ROLL</option>
                                        <option value="BDL">BUNDLE</option>
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-1 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block italic">Detailed Product Specifications (Optional)</label>
                                <textarea
                                    name="notes"
                                    defaultValue={product?.notes}
                                    placeholder="Add technical specs, shipping notes, or internal details..."
                                    rows={4}
                                    className="flex w-full rounded-2xl border-0 bg-slate-100/50 px-6 py-4 text-sm shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 font-medium placeholder:text-slate-400"
                                />
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
                                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isEdit ? <Save className="w-7 h-7" /> : <PackagePlus className="w-7 h-7" />}
                                    <span>{isEdit ? 'Update Catalog Record' : 'Registry Entry New Item'}</span>
                                </>
                            )}
                        </button>

                        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.4em] mt-10 opacity-50 italic">
                            IMS Protocol v2.1 // System Master Inventory
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
