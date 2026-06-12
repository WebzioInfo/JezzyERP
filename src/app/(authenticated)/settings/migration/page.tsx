import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MigrationCenterClient } from "@/features/settings/components/MigrationCenterClient";

export default async function MigrationCenterPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Migration Center</h1>
        <p className="text-sm text-slate-500 mt-1">Import and map data from legacy ERP systems.</p>
      </div>

      <MigrationCenterClient />
    </div>
  );
}
