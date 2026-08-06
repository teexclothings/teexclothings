export interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validateName(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "Name is required" };
  if (trimmed.length < 2) return { valid: false, message: "Name must be at least 2 characters" };
  return { valid: true, message: "" };
}

export function validatePhone(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "Phone number is required" };
  if (!/^[6-9]\d{9}$/.test(trimmed)) {
    return { valid: false, message: "Enter a valid 10-digit Indian mobile number" };
  }
  return { valid: true, message: "" };
}

export function validatePincode(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "Pincode is required" };
  if (!/^\d{6}$/.test(trimmed)) {
    return { valid: false, message: "Enter a valid 6-digit Indian pincode" };
  }
  return { valid: true, message: "" };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: `${fieldName} is required` };
  return { valid: true, message: "" };
}
