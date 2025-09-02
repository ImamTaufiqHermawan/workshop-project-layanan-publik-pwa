"use client";

import { useState, useEffect } from "react";
import { ensurePlus62Format, normalizePhoneNumber } from "@/lib/phone";

export default function PhoneInput({ 
  value, 
  onChange, 
  required = false, 
  placeholder = "+62",
  className = "",
  label = "Nomor WhatsApp",
  showDigitCount = true,
  showFormatHint = true
}) {
  const [inputValue, setInputValue] = useState(value || "+62");

  useEffect(() => {
    setInputValue(value || "+62");
  }, [value]);

  const handlePhoneChange = (e) => {
    let newValue = e.target.value;
    
    // Ensure it always starts with +62
    if (!newValue.startsWith("+62")) {
      newValue = "+62";
    }
    
    // Remove any non-digit characters after +62
    const prefix = "+62";
    const digits = newValue.substring(3).replace(/\D/g, "");
    
    // Limit to reasonable length (max 15 digits total including +62)
    const maxDigits = 13;
    const limitedDigits = digits.substring(0, maxDigits);
    
    const rawValue = prefix + limitedDigits;
    
    // Convert to proper +62 format using phone utility
    const normalizedValue = ensurePlus62Format(rawValue);
    
    setInputValue(normalizedValue);
    
    // Call parent onChange with normalized value
    if (onChange) {
      onChange(normalizedValue);
    }
  };

  const getDigitCount = () => {
    return inputValue.length > 3 ? inputValue.length - 3 : 0;
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
      )}
      
      <div className="relative">
        <input
          type="tel"
          required={required}
          value={inputValue}
          onChange={handlePhoneChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
          placeholder={placeholder}
        />
        
        {showDigitCount && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 text-sm">
              {getDigitCount() > 0 ? `${getDigitCount()} digit` : ""}
            </span>
          </div>
        )}
      </div>
      
      {showFormatHint && (
        <p className="mt-1 text-xs text-gray-500">
          Format: +62 atau 08xxx (akan otomatis dikonversi ke +62xxx)
        </p>
      )}
    </div>
  );
}
