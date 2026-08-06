"use client";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "search";
  maxLength?: number;
  id: string;
}

export default function FormInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  inputMode = "text",
  maxLength,
  id,
}: FormInputProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[9px] uppercase tracking-widest font-semibold text-neutral-500"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full bg-neutral-900 border rounded-sm px-4 py-3 text-sm text-white placeholder-neutral-600 font-light tracking-wide transition-colors focus:outline-none focus:border-white ${
          error ? "border-red-800" : "border-neutral-800 hover:border-neutral-600"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="text-[10px] text-red-400 font-light tracking-wide" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
