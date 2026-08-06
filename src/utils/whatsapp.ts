interface WhatsAppMessageParams {
  productName: string;
  category: string;
  productPrice: number;
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
}

export function generateWhatsAppMessage(params: WhatsAppMessageParams): string {
  return `🛍️ *New Product Inquiry*

━━━━━━━━━━━━━━━━━━

📦 PRODUCT

Product:
${params.productName}

Category:
${params.category}

Price:
₹${params.productPrice.toFixed(2)}

Size:
${params.selectedSize}

Color:
${params.selectedColor}

━━━━━━━━━━━━━━━━━━

🚚 SHIPPING

State:
${params.stateName}

Shipping Charge:
₹${params.shippingCharge.toFixed(2)}

━━━━━━━━━━━━━━━━━━

💰 TOTAL

Grand Total:
₹${params.grandTotal.toFixed(2)}

━━━━━━━━━━━━━━━━━━

👤 CUSTOMER DETAILS

Name:
${params.customerName}

House Name:
${params.houseName}

Address:
${params.address}

District:
${params.district}

State:
${params.state}

Pincode:
${params.pincode}

Phone:
${params.phone}

━━━━━━━━━━━━━━━━━━

Thank you.`;
}

export function openWhatsApp(phone: string, message: string): void {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
