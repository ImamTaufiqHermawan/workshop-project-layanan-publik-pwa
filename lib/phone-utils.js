/**
 * Phone utility functions for API routes (CommonJS)
 */

/**
 * Converts Indonesian phone number to +62 format
 * @param {string} phoneNumber - Phone number in various formats
 * @returns {string} Phone number in +62 format
 */
function formatToIndonesiaFormat(phoneNumber) {
  if (!phoneNumber) return phoneNumber;
  
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If starts with 0, replace with 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  
  // If doesn't start with 62, add it
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  
  // Add + prefix
  return '+' + cleaned;
}

/**
 * Validates if phone number is in valid Indonesian format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid
 */
function isValidIndonesianPhone(phoneNumber) {
  if (!phoneNumber) return false;
  
  const formatted = formatToIndonesiaFormat(phoneNumber);
  
  // Check if it's +62 followed by 8-15 digits
  const phoneRegex = /^\+62[8-9]\d{7,14}$/;
  
  return phoneRegex.test(formatted);
}

module.exports = {
  formatToIndonesiaFormat,
  isValidIndonesianPhone,
};
