"use client";

//ShippingForm.tsx
import React from 'react';
import { Address } from '@/types/invoice';

export default function ShippingForm({ shipping, setShipping }: { 
  shipping: Address; 
  setShipping: (address: Address) => void;
}) {
  const update = (key: keyof Address, value: string) => {
    setShipping({ ...shipping, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="Name"
          value={shipping.name}
          onChange={e => update("name", e.target.value)}
        />
        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
          Name
        </label>
      </div>

      <div className="relative">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="State"
          value={shipping.state}
          onChange={e => update("state", e.target.value)}
        />
        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
          State
        </label>
      </div>

      <div className="relative">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="Pin Code"
          value={shipping.pinCode ?? ""}
          onChange={e => update("pinCode", e.target.value)}
        />
        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
          Pin Code
        </label>
      </div>

      <div className="relative col-span-2">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="Address Line 1"
          value={shipping.address1}
          onChange={e => update("address1", e.target.value)}
        />
        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
          Address Line 1
        </label>
      </div>

      <div className="relative col-span-2">
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          placeholder="Address Line 2"
          value={shipping.address2 ?? ""}
          onChange={e => update("address2", e.target.value)}
        />
        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
          Address Line 2
        </label>
      </div>
    </div>
  );
}


