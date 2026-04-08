import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthenticatedLayout from "@/ui/layouts/AuthenticatedLayout";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySessionCookie();

  if (!session) {
    redirect("/login");
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
