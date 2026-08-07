"use client";

import FormInput from "@/components/ui/FormInput";
import StateDropdown from "@/components/ui/StateDropdown";
import type { DeliveryDetails } from "@/utils/localStorage";

interface DeliveryFormProps {
  formData: DeliveryDetails;
  setFormData: (data: DeliveryDetails) => void;
  errors: Record<string, string>;
  onStateChange: (stateName: string, shippingCharge: number) => void;
}

export default function DeliveryForm({ formData, setFormData, errors, onStateChange }: DeliveryFormProps) {
  function updateField(field: keyof DeliveryDetails, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500 border-b border-neutral-200 dark:border-neutral-900 pb-2">
        Delivery Details
      </h3>

      <FormInput
        id="delivery-name"
        label="Full Name"
        value={formData.customerName}
        onChange={(v) => updateField("customerName", v)}
        error={errors.customerName}
        placeholder="Your full name"
      />

      <FormInput
        id="delivery-phone"
        label="Phone Number"
        value={formData.phone}
        onChange={(v) => updateField("phone", v)}
        error={errors.phone}
        placeholder="10-digit mobile number"
        type="tel"
        inputMode="tel"
        maxLength={10}
      />

      <FormInput
        id="delivery-house"
        label="House Name / Flat No"
        value={formData.houseName}
        onChange={(v) => updateField("houseName", v)}
        error={errors.houseName}
        placeholder="House name, building, flat"
      />

      <FormInput
        id="delivery-address"
        label="Address / Street"
        value={formData.address}
        onChange={(v) => updateField("address", v)}
        error={errors.address}
        placeholder="Street, locality, landmark"
      />

      <FormInput
        id="delivery-district"
        label="District"
        value={formData.district}
        onChange={(v) => updateField("district", v)}
        error={errors.district}
        placeholder="Your district"
      />

      <StateDropdown
        value={formData.state}
        onChange={(stateName, shippingCharge) => {
          updateField("state", stateName);
          onStateChange(stateName, shippingCharge);
        }}
        error={errors.state}
      />

      <FormInput
        id="delivery-pincode"
        label="Pincode"
        value={formData.pincode}
        onChange={(v) => updateField("pincode", v)}
        error={errors.pincode}
        placeholder="6-digit pincode"
        inputMode="numeric"
        maxLength={6}
      />
    </div>
  );
}
