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
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Company Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your legal business identity, registered address, and invoice preferences</p>
      </div>

      <form
        action={async (formData: FormData) => {
          "use server";
          await updateCompanySettingsAction(formData);
        }}
        className="space-y-6"
      >
        <input type="hidden" name="id" value={settings.id} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Identity & Address */}
          <div className="lg:col-span-7 space-y-6">
            {/* Business Identity */}
            <Card>
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Business Identity</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Legal entity name and tax identifiers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    icon={<ShieldCheck size={16} />}
                    required
                  />
                  <Input
                    label="PAN Number"
                    name="pan"
                    defaultValue={settings.pan || ""}
                    placeholder="ABCDE1234F"
                    className="uppercase"
                    icon={<span className="text-[10px] font-bold text-slate-400">PAN</span>}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Registered Address */}
            <Card>
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Physical Address</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Primary operating facility for billing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Globe size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Contact Channels</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Direct contact channels printed on correspondence</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    name="phone"
                    defaultValue={settings.phone}
                    icon={<Phone size={16} />}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    defaultValue={settings.email}
                    icon={<Mail size={16} />}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display & Billing Preferences */}
            <Card>
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Invoice Display Preferences</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Controls layout elements on customer PDF invoices</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Pkg Details Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-900">Show "No. & Kind of Pkgs" Column</p>
                    <p className="text-xs text-slate-500">
                      Display physical packaging breakdown (e.g. 10 BOXES) on PDF invoices.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="showPkgDetails"
                      value="true"
                      defaultChecked={settings.showPkgDetails}
                      className="peer h-5 w-9 cursor-pointer appearance-none rounded-full bg-slate-200 transition-colors checked:bg-primary-600 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4"></span>
                  </div>
                </div>

                {/* Logo Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-900">Show Company Logo on Invoices</p>
                    <p className="text-xs text-slate-500">
                      Print your company logo at the top-left of generated PDF invoices.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="showLogo"
                      value="true"
                      defaultChecked={settings.showLogo}
                      className="peer h-5 w-9 cursor-pointer appearance-none rounded-full bg-slate-200 transition-colors checked:bg-primary-600 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4"></span>
                  </div>
                </div>

                {/* Logo Path */}
                <Input
                  label="Logo Filename (in public/ folder)"
                  name="logoUrl"
                  defaultValue={settings.logoUrl || "logo.png"}
                  placeholder="e.g. logo.png"
                  icon={<Globe size={16} />}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Bank & Action */}
          <div className="lg:col-span-5 space-y-6">
            {/* Bank Settlement */}
            <Card>
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Bank Settlement Account</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Printed on invoices for wire & NEFT receipts</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex gap-2.5">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This account will appear in the payment remittance block on all client-facing invoices.
                  </p>
                </div>

                <div className="space-y-4">
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
                    icon={<CreditCard size={16} />}
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
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Founder Profile</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Manage owner capital contributions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <Link href="/accounts/equity">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    Manage Owner Equity
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-xs text-slate-500">
                  Saving updates will immediately apply to all newly generated invoices, purchase orders, and quotations.
                </p>

                <Button
                  type="submit"
                  className="w-full h-10 font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Company Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
