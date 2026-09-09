import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CompanyService } from "@/features/settings/services/CompanyService";
import {
  Building2, Save, Landmark, Globe, Mail, Phone,
  MapPin, ShieldCheck, CheckCircle2, Info, CreditCard, Briefcase
} from "lucide-react";
import { updateCompanySettingsAction } from "@/features/settings/actions/settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui/core/Card";
import { Input } from "@/ui/core/Input";
import { Button } from "@/ui/core/Button";
import { StateSelect } from "@/components/forms/StateSelect";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const settings = await CompanyService.getSettings();

  return (
    <div className="space-y-8 animate-fade-up max-w-6xl mx-auto pb-24">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Company Profile</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Refine your business identity and billing details</p>
        </div>
      </div>

      <form
        action={async (formData: FormData) => {
          "use server";
          await updateCompanySettingsAction(formData);
        }}
        className="space-y-8"
      >
        <input type="hidden" name="id" value={settings.id} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Identity & Address ── */}
          <div className="lg:col-span-7 space-y-8">
            {/* Business Identity */}
            <Card>
              <CardHeader className="bg-slate-900 rounded-t-4xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white mt-0">Business Identity</CardTitle>
                    <CardDescription className="text-slate-400">Legal name and tax identifiers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-6 ">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <Input
                      label="Full Legal Company Name"
                      name="companyName"
                      defaultValue={settings.companyName}
                      placeholder="e.g. Jezzy Enterprises Pvt Ltd"
                      required
                    />
                  </div>
                  <Input
                    label="GSTIN Number"
                    name="gstin"
                    defaultValue={settings.gstin}
                    placeholder="29AAAAA0000A1Z5"
                    icon={<ShieldCheck size={18} />}
                    required
                  />
                  <Input
                    label="PAN Number"
                    name="pan"
                    defaultValue={settings.pan || ""}
                    placeholder="ABCDE1234F"
                    className="uppercase"
                    icon={<span className="text-[10px] font-black">PAN</span>}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Registered Address */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <CardTitle>Physical Address</CardTitle>
                    <CardDescription>Primary business location for billing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <Input
                      label="Address Line 1"
                      name="address1"
                      defaultValue={settings.address1}
                      placeholder="Building No, Street Name"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Address Line 2 (Optional)"
                      name="address2"
                      defaultValue={settings.address2 || ""}
                      placeholder="Area, Landmark"
                    />
                  </div>
                  <Input
                    label="City"
                    name="city"
                    defaultValue={settings.city}
                    placeholder="e.g. Guwahati"
                    required
                  />
                  <StateSelect
                    label="State"
                    name="state"
                    defaultValue={settings.state}
                    required
                  />
                  <Input
                    label="Pincode"
                    name="pincode"
                    defaultValue={settings.pincode}
                    placeholder="781001"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Communication Profile */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Globe size={20} />
                  </div>
                  <div>
                    <CardTitle>Communication Profile</CardTitle>
                    <CardDescription>Direct contact channels for clients</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number"
                    name="phone"
                    defaultValue={settings.phone}
                    icon={<Phone size={18} />}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    defaultValue={settings.email}
                    icon={<Mail size={18} />}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display & Billing Preferences */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <CardTitle>Display Preferences</CardTitle>
                    <CardDescription>Controls how your invoices look</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="space-y-6">
                  {/* Pkg Details Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-slate-900">Show "No. & Kind of Pkgs" Column</p>
                      <p className="text-xs text-slate-500">
                        Enable this to display physical packaging details (e.g. 10 BOXES) on your PDF invoices.
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="showPkgDetails"
                        value="true"
                        defaultChecked={settings.showPkgDetails}
                        className="peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-slate-200 transition-colors checked:bg-slate-900 focus:outline-none"
                      />
                      <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></span>
                    </div>
                  </div>

                  {/* Logo Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 group transition-all hover:bg-slate-50">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight italic">Show Company Logo on Invoice</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        If enabled, your logo will be printed at the top-left of every PDF invoice.
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="showLogo"
                        value="true"
                        defaultChecked={settings.showLogo}
                        className="peer h-6 w-12 cursor-pointer appearance-none rounded-full bg-slate-300 transition-colors checked:bg-primary-600 focus:outline-none"
                      />
                      <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-6"></span>
                    </div>
                  </div>

                  {/* Logo Path */}
                  <Input
                    label="Logo Filename (in public/ folder)"
                    name="logoUrl"
                    defaultValue={settings.logoUrl || "logo.png"}
                    placeholder="e.g. logo.png"
                    icon={<Globe size={18} />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Right Column: Bank & Action ── */}
          <div className="lg:col-span-5 space-y-8">
            {/* Bank Settlement */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <CardTitle>Bank Settlement</CardTitle>
                    <CardDescription>Verified account for payments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex gap-2.5 mb-6">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600">
                    This information will be printed on all invoices to facilitate bank transfers.
                  </p>
                </div>

                <div className="space-y-6">
                  <Input
                    label="Account Holder Name"
                    name="bankAccountName"
                    defaultValue={settings.bankAccountName}
                    placeholder="e.g. JEZZY ENTERPRISES"
                    required
                  />
                  <Input
                    label="Bank Name"
                    name="bankName"
                    defaultValue={settings.bankName}
                    placeholder="e.g. HDFC Bank"
                    required
                  />
                  <Input
                    label="Branch Name"
                    name="bankBranch"
                    defaultValue={settings.bankBranch}
                    placeholder="e.g. MG Road Branch"
                    required
                  />
                  <Input
                    label="Account Number"
                    name="bankAccountNo"
                    defaultValue={settings.bankAccountNo}
                    icon={<CreditCard size={18} />}
                    required
                  />
                  <Input
                    label="IFSC Code"
                    name="bankIfsc"
                    defaultValue={settings.bankIfsc}
                    className="uppercase font-mono"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Founder Equity Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <CardTitle>Founder Profile</CardTitle>
                    <CardDescription>Manage owner equity and capital contributions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <Link href="/accounts/equity">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                  >
                    Manage Equity
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-slate-500">
                  Applying these changes will update your company profile across all future invoices.
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
