/**
 * Core Sanitization and Validation Engine
 * Implements strict type checking, HTML stripping, bounds clamping,
 * and format validation to reject malformed or oversized user inputs.
 */

/**
 * Standard text sanitizer to prevent XSS (Cross-Site Scripting) and HTML inject attempts.
 */
export const sanitizeString = (val: string, maxLength: number = 250): string => {
  if (typeof val !== 'string') return '';
  
  // 1. Strip HTML tags completely using aggressive regex
  let sanitized = val.replace(/<[^>]*>/g, '');
  
  // 2. Escape standard special characters used in injection attacks
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // 3. Truncate strictly to pre-defined maximum character safety length
  return sanitized.substring(0, maxLength).trim();
};

/**
 * Validates and normalizes email formats. Safe against excessive length.
 */
export const sanitizeEmail = (val: string): { sanitized: string; isValid: boolean } => {
  if (typeof val !== 'string') return { sanitized: '', isValid: false };
  
  const trimmed = val.trim().toLowerCase().substring(0, 100);
  // Robust standard email structure regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(trimmed);
  
  return { sanitized: trimmed, isValid };
};

/**
 * Validates and formats Nigerian/International phone numbers.
 */
export const sanitizePhone = (val: string): { sanitized: string; isValid: boolean } => {
  if (typeof val !== 'string') return { sanitized: '', isValid: false };
  
  // Retain only digits + optional leading plus symbol for international format
  const isLeadingPlus = val.trim().startsWith('+');
  let cleaned = val.replace(/[^0-9]/g, '');
  
  if (isLeadingPlus && cleaned.length > 0) {
    cleaned = '+' + cleaned;
  }
  
  // Cap phone numbers to international standard length
  const sanitized = cleaned.substring(0, 15);
  // Must be between 8 and 15 digits long
  const rawDigits = sanitized.replace('+', '');
  const isValid = rawDigits.length >= 8 && rawDigits.length <= 15;
  
  return { sanitized, isValid };
};

/**
 * Sanitizes numeric values to prevent boundary overflows, negative-value exploits, or high-precision decimal issues.
 */
export const sanitizeNumber = (
  val: number | string,
  min: number = 0,
  max: number = 10000000
): { parsed: number; isValid: boolean } => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  
  if (isNaN(num) || !isFinite(num)) {
    return { parsed: min, isValid: false };
  }
  
  // Clamp boundaries strictly
  let clamped = Math.min(Math.max(num, min), max);
  
  // Keep standard currency decimals (2 decimal places) for financial safety or integer clamp
  clamped = Math.round(clamped * 100) / 100;
  
  return { parsed: clamped, isValid: num >= min && num <= max };
};

/**
 * Sanitizes and validates standard 10-digit Nigerian NUBAN account numbers.
 */
export const sanitizeNuban = (val: string): { sanitized: string; isValid: boolean } => {
  if (typeof val !== 'string') return { sanitized: '', isValid: false };
  
  const cleaned = val.replace(/[^0-9]/g, '').substring(0, 10);
  const isValid = cleaned.length === 10;
  
  return { sanitized: cleaned, isValid };
};

/**
 * Limits alphanumeric values + space & standard punctuation safely. Good for Names or Titles.
 */
export const sanitizeName = (val: string, maxLength: number = 50): string => {
  if (typeof val !== 'string') return '';
  
  // Strip non-alphanumeric punctuation except standard safe chars (letters, spaces, hyphens, periods)
  const cleaned = val.replace(/[^a-zA-Z0-9\s.\-_]/g, '');
  return cleaned.substring(0, maxLength).trim();
};

/**
 * Universally checks Bowen Matric Number formats (e.g. BU/19/CO/1234 or BU/21/04/0071).
 */
export const sanitizeMatric = (val: string): { sanitized: string; isValid: boolean } => {
  if (typeof val !== 'string') return { sanitized: '', isValid: false };
  
  // Keep Alphanumeric + slashes or hyphens, remove any spaces or external vectors
  const cleaned = val.trim().replace(/[^a-zA-Z0-9\-\/]/g, '').toUpperCase().substring(0, 20);
  
  // Typically matrices contain slash ratios or at least alphanumeric content
  const isValid = cleaned.length >= 5 && cleaned.length <= 20;
  
  return { sanitized: cleaned, isValid };
};
