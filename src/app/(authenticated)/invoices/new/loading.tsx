import { Skeleton } from "@/ui/core/Skeleton";

export default function NewInvoiceLoading() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto p-1">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <div className="grid gap-8">
        <Skeleton className="h-[200px] w-full rounded-[2.5rem]" />
        <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <Skeleton className="lg:col-span-12 xl:col-span-7 h-[200px] rounded-[3rem]" />
           <Skeleton className="lg:col-span-12 xl:col-span-5 h-[400px] rounded-[3rem]" />
        </div>
      </div>
    </div>
  );
}
