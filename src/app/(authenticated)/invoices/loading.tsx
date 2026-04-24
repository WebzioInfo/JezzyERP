import { Card, CardContent } from "@/ui/core/Card";

export default function InvoicesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-slate-200 rounded-xl" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-12 w-44 bg-slate-200 rounded-2xl" />
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-slate-200/60 overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 h-12 bg-slate-100 rounded-[1.25rem] w-full" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-24 bg-slate-100 rounded-2xl" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 h-16" />
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="h-24">
                  <td className="px-8"><div className="h-10 w-32 bg-slate-100 rounded-xl" /></td>
                  <td className="px-8"><div className="h-10 w-48 bg-slate-100 rounded-xl" /></td>
                  <td className="px-8"><div className="h-10 w-24 bg-slate-100 rounded-xl" /></td>
                  <td className="px-8"><div className="h-10 w-32 bg-slate-100 rounded-xl ml-auto" /></td>
                  <td className="px-8"><div className="h-10 w-20 bg-slate-100 rounded-xl mx-auto" /></td>
                  <td className="px-8"><div className="h-10 w-10 bg-slate-100 rounded-xl ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
