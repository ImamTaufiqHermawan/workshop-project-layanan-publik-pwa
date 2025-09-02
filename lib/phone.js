/**
 * Normalize Indonesian phone number to E.164 format with +62 prefix
 * @param {string} phone - Phone number to normalize
 * @returns {string} E.164 formatted phone number starting with +62
 */
function normalizePhoneNumber(phone) {
  if (!phone) return null;

  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, "");

  // If it starts with 62, it's already in international format
  if (cleaned.startsWith("62")) {
    return `+${cleaned}`;
  }

  // If it starts with 8, it's a mobile number, add 62
  if (cleaned.startsWith("8")) {
    return `+62${cleaned}`;
  }

  // If it's 8 digits (Jakarta mobile), add 62
  if (cleaned.length === 8) {
    return `+62${cleaned}`;
  }

  // If it's 9 digits (mobile), add 62
  if (cleaned.length === 9) {
    return `+62${cleaned}`;
  }

  // If it's 10 digits (mobile), add 62
  if (cleaned.length === 10) {
    return `+62${cleaned}`;
  }

  // If it's 11 digits (mobile), add 62
  if (cleaned.length === 11) {
    return `+62${cleaned}`;
  }

  // If it's 12 digits (mobile), add 62
  if (cleaned.length === 12) {
    return `+62${cleaned}`;
  }

  // If it's 13 digits (mobile), add 62
  if (cleaned.length === 13) {
    return `+62${cleaned}`;
  }

  // If it's already 14 digits and starts with 62, add +
  if (cleaned.length === 14 && cleaned.startsWith("62")) {
    return `+${cleaned}`;
  }

  // If it's already 15 digits and starts with 62, add +
  if (cleaned.length === 15 && cleaned.startsWith("62")) {
    return `+${cleaned}`;
  }

  // Default: assume it's a mobile number and add 62
  return `+62${cleaned}`;
}

/**
 * Validate if phone number is a valid Indonesian mobile number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function isValidIndonesianMobile(phone) {
  if (!phone) return false;

  const normalized = normalizePhoneNumber(phone);

  // Check if it's a valid Indonesian mobile number
  // Indonesian mobile numbers start with +62
  const mobileRegex = /^\+62[1-9][0-9]{6,11}$/;

  return mobileRegex.test(normalized);
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
function formatPhoneForDisplay(phone) {
  if (!phone) return "";

  const normalized = normalizePhoneNumber(phone);

  if (!normalized) return phone;

  // Format as +62 8xx xxxx xxxx
  const match = normalized.match(/^\+62(8\d{2})(\d{3})(\d{3})(\d{3})$/);
  if (match) {
    return `+62 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }

  // Format as +62 8xx xxxx xxxx (shorter)
  const match2 = normalized.match(/^\+62(8\d{2})(\d{3})(\d{4})$/);
  if (match2) {
    return `+62 ${match2[1]} ${match2[2]} ${match2[3]}`;
  }

  return normalized;
}

/**
 * Format phone number for input field (show +62 prefix)
 * @param {string} phone - Phone number to format for input
 * @returns {string} Formatted phone number for input field
 */
function formatPhoneForInput(phone) {
  if (!phone) return "+62";
  
  const normalized = normalizePhoneNumber(phone);
  
  if (!normalized) return "+62";
  
  // Remove +62 prefix for input field
  return normalized.replace(/^\+62/, "+62");
}

/**
 * Ensure phone number always starts with +62
 * @param {string} phone - Phone number to ensure format
 * @returns {string} Phone number guaranteed to start with +62
 */
function ensurePlus62Format(phone) {
  if (!phone) return null;
  
  const normalized = normalizePhoneNumber(phone);
  
  // Double check it starts with +62
  if (normalized && normalized.startsWith("+62")) {
    return normalized;
  }
  
  // If somehow it doesn't, force it
  const cleaned = phone.replace(/\D/g, "");
  
  // Remove leading zeros and 62 if present
  let processed = cleaned.replace(/^0+/, "").replace(/^62/, "");
  
  // If it starts with 8, keep it (don't remove)
  return `+62${processed}`;
}

module.exports = {
  normalizePhoneNumber,
  isValidIndonesianMobile,
  formatPhoneForDisplay,
  formatPhoneForInput,
  ensurePlus62Format,
};
