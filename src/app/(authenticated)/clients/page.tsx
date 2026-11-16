import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientTable } from "@/features/clients/components/ClientTable";
import { ClientService } from "@/features/clients/services/ClientService";

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function ClientsPage({ searchParams }: PageProps) {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const query = (await searchParams).q;
    const clients = await ClientService.getAllActive(query);

    return (
        <div className="space-y-5 pb-12">
            <div className="w-full">
                <ClientTable clients={clients} />
            </div>
        </div>
    );
}
