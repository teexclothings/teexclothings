"use client";

import { Loader2 } from "lucide-react";

interface OrderSummaryCardProps {
  productImage: string;
  productName: string;
  category: string;
  selectedSize: string;
  selectedColor: string;
  productPrice: number;
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
  shippingCharge,
  shippingLoading,
  stateName,
}: OrderSummaryCardProps) {
  const grandTotal = shippingCharge !== null ? productPrice + shippingCharge : null;

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-800">
        <h3 className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
          Order Summary
        </h3>
      </div>

      {/* Product row */}
      <div className="flex items-start space-x-3 p-4">
        <div className="w-16 h-20 bg-neutral-800 rounded-sm overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-white tracking-wide uppercase leading-tight">
            {productName}
          </p>
          {category && (
            <p className="text-[9px] text-neutral-500 tracking-widest uppercase">{category}</p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedSize && (
              <span className="text-[8px] uppercase tracking-widest bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-sm">
                Size: {selectedSize}
              </span>
            )}
            {selectedColor && (
              <span className="text-[8px] uppercase tracking-widest bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-sm">
                Color: {selectedColor}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="border-t border-neutral-800 px-4 py-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-neutral-400 font-light">Product Price</span>
          <span className="text-white font-mono">₹{productPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-neutral-400 font-light">
            Shipping {stateName ? `(${stateName})` : ""}
          </span>
          {shippingLoading ? (
            <Loader2 size={12} className="animate-spin text-neutral-500" />
          ) : shippingCharge !== null ? (
            <span className="text-white font-mono">₹{shippingCharge.toFixed(2)}</span>
          ) : (
            <span className="text-neutral-600 text-[10px] font-light">Select state</span>
          )}
        </div>

        <div className="h-[1px] bg-neutral-800 my-1" />

        <div className="flex justify-between text-sm font-medium">
          <span className="text-white">Grand Total</span>
          {grandTotal !== null ? (
            <span className="text-white font-mono">₹{grandTotal.toFixed(2)}</span>
          ) : (
            <span className="text-neutral-600 text-xs font-light">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
