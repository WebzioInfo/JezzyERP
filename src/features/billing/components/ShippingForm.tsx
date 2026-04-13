import { Address } from '@/types/invoice';
import { Input } from '@/ui/core/Input';
import { User, MapPin, Hash, Truck } from 'lucide-react';

export default function ShippingForm({ shipping, setShipping }: { 
  shipping: Address; 
  setShipping: (address: Address) => void;
}) {
  const update = (key: keyof Address, value: string) => {
    setShipping({ ...shipping, [key]: value });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Input
        label="Shipping Receiver Name"
        placeholder="Contact person or Location name"
        value={shipping.name}
        onChange={e => update("name", e.target.value)}
        icon={<User size={16} />}
        className="h-12 font-bold"
      />

      <div className="space-y-4 pt-2 border-t border-slate-50">
        <Input
          label="Address Line 1"
          placeholder="Delivery building, Door no, etc."
          value={shipping.address1}
          onChange={e => update("address1", e.target.value)}
          icon={<Truck size={16} />}
          className="h-12"
        />
        <Input
          label="Address Line 2"
          placeholder="Locality, Landmark (Optional)"
          value={shipping.address2 ?? ""}
          onChange={e => update("address2", e.target.value)}
          icon={<MapPin size={16} />}
          className="h-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Shipping State"
            placeholder="State"
            value={shipping.state}
            onChange={e => update("state", e.target.value)}
            className="h-12 font-bold"
          />
          <Input
            label="Shipping Pin Code"
            placeholder="000000"
            value={shipping.pinCode ?? ""}
            onChange={e => update("pinCode", e.target.value)}
            icon={<Hash size={14} />}
            className="h-12 font-mono"
          />
        </div>
      </div>
    </div>
  );
}



