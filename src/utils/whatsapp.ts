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
  const line = "━━━━━━━━━━━━━━━━━━";

  return [
    `🛍️ *New Product Inquiry*`,
    "",
    line,
    "",
    `👕 *${params.productName.toUpperCase()}*`,
    "------------------",
    `🏷️ Category: ${params.category}`,
    `💰 Price: ₹${params.productPrice.toFixed(2)}`,
    `📦 Quantity: ${params.quantity}`,
    `💵 Subtotal: ₹${subtotal.toFixed(2)}`,
    `📏 Size: ${params.selectedSize}`,
    `🎨 Color: ${params.selectedColor}`,
    "------------------",
    "",
    line,
    "",
    `🚚 *SHIPPING*`,
    "",
    `📍 State: ${params.stateName}`,
    `💲 Shipping Charge: ₹${params.shippingCharge.toFixed(2)}`,
    "",
    line,
    "",
    `💰 *GRAND TOTAL: ₹${params.grandTotal.toFixed(2)}*`,
    "",
    line,
    "",
    `👤 *CUSTOMER DETAILS*`,
    "",
    `📛 Name: ${params.customerName}`,
    `🏠 House: ${params.houseName}`,
    `📍 Address: ${params.address}`,
    `🏙️ District: ${params.district}`,
    `🗺️ State: ${params.state}`,
    `📮 Pincode: ${params.pincode}`,
    `📞 Phone: ${params.phone}`,
    "",
    line,
    "",
    `🔗 *VIEW PRODUCT ON SITE*`,
    params.productUrl,
    "",
    line,
    "",
    `Looking forward to your response! 🙏`
  ].join("\n");
}

export function openWhatsApp(phone: string, message: string): void {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  // Ensure the message string is processed as clean UTF-8
  const processedMessage = new TextDecoder("utf-8").decode(
    new TextEncoder().encode(message)
  );
  const encoded = encodeURIComponent(processedMessage);
  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
