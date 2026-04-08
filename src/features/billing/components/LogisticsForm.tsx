import { FileText, Truck, Package, CloudUpload } from 'lucide-react';

export default function LogisticsForm({ logistics, setLogistics }: any) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        <input
          className="border border-gray-300 p-3 pl-10 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="E-Way Bill"
          value={logistics.ewayBill || ''}
          onChange={e => setLogistics({ ...logistics, ewayBill: e.target.value })}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          E-Way Bill Number
        </label>
      </div>

      {/* Cloudinary Upload for EWAYbill */}
      <div className="pt-2">
        <label className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed transition-all cursor-pointer group ${logistics.ewayBillUrl ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary-200'}`}>
            <div className="flex flex-col items-center justify-center pt-2 pb-3">
                <CloudUpload className={`w-6 h-6 mb-1 transition-colors ${logistics.ewayBillUrl ? 'text-emerald-500' : 'text-slate-400 group-hover:text-primary-500'}`} />
                <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${logistics.ewayBillUrl ? 'text-emerald-600' : 'text-slate-500 group-hover:text-primary-600'}`}>
                    {logistics.ewayBillUrl ? 'EWAYbill Staged' : 'Attach EWAYbill PDF/Image'}
                </p>
            </div>
            <input type="file" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('file', file);

                try {
                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (!res.ok) throw new Error('Upload failed');
                    const data = await res.json();
                    setLogistics({ ...logistics, ewayBillUrl: data.url });
                } catch (err) {
                    console.error('Upload Error:', err);
                    alert('Failed to upload EWAYbill to Cloudinary.');
                }
            }} />
        </label>
        {logistics.ewayBillUrl && (
            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-2 text-center">
                ✓ Document Secured via Cloudinary
            </p>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Truck className="w-5 h-5 text-gray-400" />
        </div>
        <input
          className="border border-gray-300 p-3 pl-10 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Vehicle No"
          value={logistics.vehicleNo || ''}
          onChange={e => setLogistics({ ...logistics, vehicleNo: e.target.value })}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          Vehicle Number
        </label>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Package className="w-5 h-5 text-gray-400" />
        </div>
        <input
          className="border border-gray-300 p-3 pl-10 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Dispatched Through"
          value={logistics.dispatchedThrough || ''}
          onChange={e => setLogistics({ ...logistics, dispatchedThrough: e.target.value })}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          Dispatched Through
        </label>
      </div>
    </div>
  );
}

