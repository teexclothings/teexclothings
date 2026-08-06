const STORAGE_KEY = "teex_delivery";

export interface DeliveryDetails {
  customerName: string;
  houseName: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
}

export function saveDeliveryDetails(data: DeliveryDetails): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is unavailable (SSR, private mode, etc.)
  }
}

export function loadDeliveryDetails(): DeliveryDetails | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DeliveryDetails;
  } catch {
    return null;
  }
}

export function clearDeliveryDetails(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
