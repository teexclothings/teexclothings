"use client";

import { Loader2 } from "lucide-react";

interface OrderSummaryCardProps {
  productImage: string;
  productName: string;
  category: string;
  selectedSize: string;
  selectedColor: string;
  productPrice: number;
  quantity: number;
  shippingCharge: number | null;
  shippingLoading: boolean;
  stateName: string;
}

export default function OrderSummaryCard({
  productImage,
  productName,
  category,
  selectedSize,
  selectedColor,
  productPrice,
  quantity,
  shippingCharge,
  shippingLoading,
  stateName,
}: OrderSummaryCardProps) {
  const subtotal = productPrice * quantity;
  const grandTotal = shippingCharge !== null ? subtotal + shippingCharge : null;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
          Order Summary
        </h3>
      </div>

      {/* Product row */}
      <div className="flex items-start space-x-3 p-4">
        <div className="w-16 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-sm overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-black dark:text-white tracking-wide uppercase leading-tight">
            {productName}
          </p>
          {category && (
            <p className="text-[9px] text-neutral-500 tracking-widest uppercase">{category}</p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedSize && (
              <span className="text-[8px] uppercase tracking-widest bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 px-2 py-0.5 rounded-sm">
                Size: {selectedSize}
              </span>
            )}
            {selectedColor && (
              <span className="text-[8px] uppercase tracking-widest bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 px-2 py-0.5 rounded-sm">
                Color: {selectedColor}
              </span>
            )}
            <span className="text-[8px] uppercase tracking-widest bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 px-2 py-0.5 rounded-sm">
              Qty: {quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-400 font-light">Product Price</span>
          <span className="text-black dark:text-white font-mono">₹{productPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-400 font-light">Quantity</span>
          <span className="text-black dark:text-white font-mono">x{quantity}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-400 font-light">Subtotal</span>
          <span className="text-black dark:text-white font-mono">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-400 font-light">
            Shipping {stateName ? `(${stateName})` : ""}
          </span>
          {shippingLoading ? (
            <Loader2 size={12} className="animate-spin text-neutral-500" />
          ) : shippingCharge !== null ? (
            <span className="text-black dark:text-white font-mono">₹{shippingCharge.toFixed(2)}</span>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-600 text-[10px] font-light">Select state</span>
          )}
        </div>

        <div className="h-[1px] bg-neutral-250 dark:bg-neutral-850 my-1" />

        <div className="flex justify-between text-sm font-medium">
          <span className="text-black dark:text-white">Grand Total</span>
          {grandTotal !== null ? (
            <span className="text-black dark:text-white font-mono">₹{grandTotal.toFixed(2)}</span>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-600 text-xs font-light">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
