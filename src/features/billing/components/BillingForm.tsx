import { Address } from "@/types/invoice";
import { Input } from "@/ui/core/Input";
import { User, MapPin, Phone, Hash } from "lucide-react";

export default function BillingForm({ billing, setBilling }: { 
  billing: Address; 
  setBilling: (address: Address) => void;
}) {
  const update = (key: keyof Address, value: string) => {
    setBilling({ ...billing, [key]: value });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Input
        label="Billing Entity Name"
        placeholder="Full name or Company name"
        value={billing.name}
        onChange={e => update("name", e.target.value)}
        icon={<User size={16} />}
        className="h-12 font-bold"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="GST Identification No."
          placeholder="32AAAAA0000A1Z0"
          value={billing.gst ?? ""}
          onChange={e => update("gst", e.target.value)}
          icon={<ShieldCheck size={16} />}
          className="h-12 font-mono uppercase"
        />
        <Input
          label="Phone / Mobile"
          placeholder="+91 00000 00000"
          value={billing.phone ?? ""}
          onChange={e => update("phone", e.target.value)}
          icon={<Phone size={16} />}
          className="h-12"
        />
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-50">
        <Input
          label="Address Line 1"
          placeholder="Building, Street, Landmark"
          value={billing.address1}
          onChange={e => update("address1", e.target.value)}
          icon={<MapPin size={16} />}
          className="h-12"
        />
        <Input
          label="Address Line 2"
          placeholder="Local area, Sub-locality (Optional)"
          value={billing.address2 ?? ""}
          onChange={e => update("address2", e.target.value)}
          icon={<MapPin size={16} />}
          className="h-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="State / Province"
            placeholder="Kerala"
            value={billing.state}
            onChange={e => update("state", e.target.value)}
            className="h-12 font-bold"
          />
          <Input
            label="Postal Pin Code"
            placeholder="600001"
            value={billing.pinCode ?? ""}
            onChange={e => update("pinCode", e.target.value)}
            icon={<Hash size={14} />}
            className="h-12 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

import { ShieldCheck } from "lucide-react";

