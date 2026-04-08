"use client";

//BillingForm.tsx

import { Address } from "@/types/invoice";



export default function BillingForm({ billing, setBilling }: { 
  billing: Address; 
  setBilling: (address: Address) => void;
}) {
  const update = (key: keyof Address, value: string) => {
    setBilling({ ...billing, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Billing Name"
          value={billing.name}
          onChange={e => update("name", e.target.value)}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          Billing Name
        </label>
      </div>

      <div className="relative">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="GST Number"
          value={billing.gst ?? ""}
          onChange={e => update("gst", e.target.value)}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          GST Number
        </label>
      </div>

      <div className="relative col-span-2">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Address Line 1"
          value={billing.address1}
          onChange={e => update("address1", e.target.value)}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          Address Line 1
        </label>
      </div>

      <div className="relative col-span-2">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Address Line 2"
          value={billing.address2 ?? ""}
          onChange={e => update("address2", e.target.value)}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          Address Line 2
        </label>
      </div>

      <div className="relative">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Phone"
          value={billing.phone ?? ""}
          onChange={e => update("phone", e.target.value)}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          Phone
        </label>
      </div>

      <div className="relative">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="State"
          value={billing.state}
          onChange={e => update("state", e.target.value)}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          State
        </label>
      </div>

      <div className="relative">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Pin Code"
          value={billing.pinCode ?? ""}
          onChange={e => update("pinCode", e.target.value)}
        />
        <label className="absolute -top-2 left-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 px-1 text-xs text-gray-600">
          Pin Code
        </label>
      </div>
    </div>
  );
}
