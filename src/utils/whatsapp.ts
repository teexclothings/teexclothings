interface WhatsAppMessageParams {
  productName: string;
  category: string;
  productPrice: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  stateName: string;
  shippingCharge: number;
  grandTotal: number;
  customerName: string;
  houseName: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  productUrl: string;
}

export function generateWhatsAppMessage(params: WhatsAppMessageParams): string {
  const subtotal = params.productPrice * params.quantity;
  return `🛍️ *New Product Inquiry*

━━━━━━━━━━━━━━━━━━

👕 *${params.productName.toUpperCase()}*
------------------
🏷️ Category: ${params.category}
💰 Price: ₹${params.productPrice.toFixed(2)}
📦 Quantity: ${params.quantity}
💵 Subtotal: ₹${subtotal.toFixed(2)}
📏 Size: ${params.selectedSize}
🎨 Color: ${params.selectedColor}
------------------

━━━━━━━━━━━━━━━━━━

🚚 *SHIPPING*

📍 State: ${params.stateName}
💲 Shipping Charge: ₹${params.shippingCharge.toFixed(2)}

━━━━━━━━━━━━━━━━━━

💰 *GRAND TOTAL: ₹${params.grandTotal.toFixed(2)}*

━━━━━━━━━━━━━━━━━━

👤 *CUSTOMER DETAILS*

📛 Name: ${params.customerName}
🏠 House: ${params.houseName}
📍 Address: ${params.address}
🏙️ District: ${params.district}
🗺️ State: ${params.state}
📮 Pincode: ${params.pincode}
📞 Phone: ${params.phone}

━━━━━━━━━━━━━━━━━━

🔗 *VIEW PRODUCT ON SITE*
${params.productUrl}

━━━━━━━━━━━━━━━━━━

Looking forward to your response! 🙏`;
}

export function openWhatsApp(phone: string, message: string): void {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
