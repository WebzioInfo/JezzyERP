import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/auth";

export default async function RootPage() {
  const session = await verifySessionCookie();
  if (session) {
    redirect("/dashboard");
  }
  redirect("/login");
}
