"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import BottomSheet from "@/components/ui/BottomSheet";
import OrderSummaryCard from "@/components/purchase/OrderSummaryCard";
import DeliveryForm from "@/components/purchase/DeliveryForm";
import { validateName, validatePhone, validatePincode, validateRequired } from "@/utils/validation";
import { generateWhatsAppMessage, openWhatsApp } from "@/utils/whatsapp";
import { saveDeliveryDetails, loadDeliveryDetails } from "@/utils/localStorage";
import type { DeliveryDetails } from "@/utils/localStorage";
import { Loader2, MessageSquare, AlertTriangle } from "lucide-react";

interface PurchaseProduct {
  title: string;
  price: number;
  images: string[];
  categories?: { name: string };
}

interface PurchaseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: PurchaseProduct;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  initialState?: string;
  initialShippingCharge?: number | null;
}

const emptyForm: DeliveryDetails = {
  customerName: "",
  houseName: "",
  address: "",
  district: "",
  state: "",
  pincode: "",
  phone: "",
};

export default function PurchaseSheet({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColor,
  quantity,
  initialState,
  initialShippingCharge,
}: PurchaseSheetProps) {
  const [formData, setFormData] = useState<DeliveryDetails>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shippingCharge, setShippingCharge] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string>("TEEX");
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState(false);
  const [sending, setSending] = useState(false);

  // Load settings on mount
  useEffect(() => {
    if (!isOpen) return;

    async function fetchSettings() {
      setSettingsLoading(true);
      setSettingsError(false);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("settings")
          .select("whatsapp, shop_name")
          .eq("id", true)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setWhatsappNumber(data.whatsapp || null);
          setShopName(data.shop_name || "TEEX");
        }
      } catch {
        setSettingsError(true);
      } finally {
        setSettingsLoading(false);
      }
    }

    fetchSettings();
  }, [isOpen]);

  const fetchShippingForState = useCallback(async (stateName: string) => {
    setShippingLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("shipping_charges")
        .select("shipping_charge")
        .eq("state_name", stateName)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      setShippingCharge(data?.shipping_charge ?? null);
    } catch {
      setShippingCharge(null);
    } finally {
      setShippingLoading(false);
    }
  }, []);

  // Pre-fill from localStorage on open (use ref to avoid re-initializing)
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!isOpen) {
      initializedRef.current = false;
      return;
    }
    if (initializedRef.current) return;
    initializedRef.current = true;

    const saved = loadDeliveryDetails() || { ...emptyForm };
    if (initialState) {
      saved.state = initialState;
    }

    // Schedule state update outside effect synchronous body
    queueMicrotask(() => {
      setFormData(saved);
      if (initialShippingCharge !== undefined && initialShippingCharge !== null) {
        setShippingCharge(initialShippingCharge);
      } else if (saved.state) {
        fetchShippingForState(saved.state);
      }
    });
  }, [isOpen, initialState, initialShippingCharge, fetchShippingForState]);

  function handleStateChange(_stateName: string, charge: number) {
    setShippingCharge(charge);
  }

  // Save to localStorage on form changes
  useEffect(() => {
    if (formData.customerName || formData.phone || formData.address) {
      saveDeliveryDetails(formData);
    }
  }, [formData]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    const nameResult = validateName(formData.customerName);
    if (!nameResult.valid) newErrors.customerName = nameResult.message;

    const phoneResult = validatePhone(formData.phone);
    if (!phoneResult.valid) newErrors.phone = phoneResult.message;

    const pincodeResult = validatePincode(formData.pincode);
    if (!pincodeResult.valid) newErrors.pincode = pincodeResult.message;

    const houseResult = validateRequired(formData.houseName, "House name");
    if (!houseResult.valid) newErrors.houseName = houseResult.message;

    const addressResult = validateRequired(formData.address, "Address");
    if (!addressResult.valid) newErrors.address = addressResult.message;

    const districtResult = validateRequired(formData.district, "District");
    if (!districtResult.valid) newErrors.district = districtResult.message;

    const stateResult = validateRequired(formData.state, "State");
    if (!stateResult.valid) newErrors.state = stateResult.message;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSend() {
    if (!validate()) return;

    if (!whatsappNumber) {
      setErrors((prev) => ({
        ...prev,
        _global: "WhatsApp number is not configured. Please contact the store.",
      }));
      return;
    }

    if (shippingCharge === null) {
      setErrors((prev) => ({
        ...prev,
        state: "Please select a state to calculate shipping",
      }));
      return;
    }

    setSending(true);

    const grandTotal = (product.price * quantity) + shippingCharge;

    const message = generateWhatsAppMessage({
      productName: product.title,
      category: product.categories?.name || "Uncategorized",
      productPrice: product.price,
      quantity,
      selectedSize,
      selectedColor,
      stateName: formData.state,
      shippingCharge,
      grandTotal,
      customerName: formData.customerName.trim(),
      houseName: formData.houseName.trim(),
      address: formData.address.trim(),
      district: formData.district.trim(),
      state: formData.state,
      pincode: formData.pincode.trim(),
      phone: formData.phone.trim(),
    });

    // Save final form data
    saveDeliveryDetails(formData);

    openWhatsApp(whatsappNumber, message);

    setSending(false);
  }

  const productImage = (product.images.length > 0 ? product.images[0] : "/placeholder-product.jpg") ?? "/placeholder-product.jpg";

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={`Order from ${shopName}`}>
      {settingsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-neutral-500" />
        </div>
      ) : settingsError ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
          <AlertTriangle size={24} className="text-red-400" />
          <p className="text-xs text-red-400 font-light">Failed to load store settings. Please try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left column: Summary */}
          <div className="space-y-6">
            <OrderSummaryCard
              productImage={productImage}
              productName={product.title}
              category={product.categories?.name || ""}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              productPrice={product.price}
              quantity={quantity}
              shippingCharge={shippingCharge}
              shippingLoading={shippingLoading}
              stateName={formData.state}
            />
          </div>

          {/* Right column: Form and Actions */}
          <div className="space-y-6">
            <DeliveryForm
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              onStateChange={handleStateChange}
            />

            {/* Global error */}
            {errors._global && (
              <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-sm px-4 py-3">
                <AlertTriangle size={14} className="text-red-650 dark:text-red-400 flex-shrink-0" />
                <p className="text-[10px] text-red-850 dark:text-red-400 font-light">{errors._global}</p>
              </div>
            )}

            {/* Send button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="w-full flex items-center justify-center space-x-2 bg-green-700 hover:bg-green-600 text-white px-6 py-4 text-xs font-semibold tracking-widest uppercase transition-all rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:animate-scale-tap"
              >
                {sending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <MessageSquare size={16} />
                    <span>Send via WhatsApp</span>
                  </>
                )}
              </button>

              <p className="text-[8px] text-neutral-600 font-light text-center tracking-wider uppercase">
                Your order details will be sent to our WhatsApp for confirmation
              </p>
            </div>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
