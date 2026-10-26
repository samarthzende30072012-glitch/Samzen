/**
 * SAMZEN Security Masking Utilities
 * 
 * Strict Requirement:
 * Sensitive user credentials, numbers, and access codes (such as 8-digit access numbers/OTPs)
 * must be completely hidden from view on user screens and phones.
 * Only display the first letter/digit or mask the remaining digits for security.
 */

/**
 * Masks an 8-digit access code:
 * For the Master Founder code (30072012), it is completely hidden from view and masked.
 * For regular member codes, only displays the first character/digit and masks the rest.
 * Example: "30072012" -> "••••••••" (Master Protected)
 * Example: "29133893" -> "2•••••••"
 */
export function maskAccessCode(code: string | undefined | null): string {
  if (!code) return '••••••••';
  const clean = String(code).trim();
  if (clean === '30072012') {
    return '••••••••'; // Completely masked for master security
  }
  if (clean.length <= 1) return clean + '•••••••';
  return clean.charAt(0) + '•'.repeat(Math.max(clean.length - 1, 7));
}

/**
 * Returns a secure display label for access codes, strictly protecting the Master code
 */
export function getDisplayAccessCode(code: string | undefined | null, isCeoView: boolean = false): string {
  if (!code) return '••••••••';
  const clean = String(code).trim();
  if (clean === '30072012') {
    return 'Master Protected';
  }
  return isCeoView ? clean : maskAccessCode(clean);
}

/**
 * Masks a phone number:
 * Preserves the country code prefix (e.g., "+91 "), displays ONLY the first phone digit,
 * and masks all remaining digits for security.
 * Example: "+91 8605042855" -> "+91 8•••••••••"
 * Example: "8605042855" -> "8•••••••••"
 */
export function maskPhoneNumber(phone: string | undefined | null): string {
  if (!phone) return '';
  const trimmed = String(phone).trim();
  
  // Match prefix like "+91 " or "+91-" or "+1 "
  const prefixMatch = trimmed.match(/^(\+\d{1,3}[\s-]?)?(.*)$/);
  const prefix = prefixMatch?.[1] || '';
  const body = prefixMatch?.[2] || '';
  
  if (!body) return trimmed;
  
  // Find first digit/character of the actual subscriber number
  const firstDigit = body.charAt(0);
  const remainingDigits = body.slice(1).replace(/\d/g, '•');
  
  return `${prefix}${firstDigit}${remainingDigits}`;
}

/**
 * Masks an email address:
 * Only displays the first letter of the username, masking the remaining characters of the name.
 * Example: "archanazende1710@gmail.com" -> "a•••••••••••••••@gmail.com"
 * Example: "samarthzende30072012@gmail.com" -> "s•••••••••••••••••••@gmail.com"
 */
export function maskEmailAddress(email: string | undefined | null): string {
  if (!email) return '';
  const trimmed = String(email).trim();
  const atIdx = trimmed.indexOf('@');
  if (atIdx === -1) {
    if (trimmed.length <= 1) return trimmed;
    return trimmed.charAt(0) + '•'.repeat(trimmed.length - 1);
  }
  
  const username = trimmed.slice(0, atIdx);
  const domain = trimmed.slice(atIdx);
  const firstLetter = username.charAt(0);
  const maskedUser = firstLetter + '•'.repeat(Math.max(username.length - 1, 4));
  
  return `${maskedUser}${domain}`;
}

/**
 * Masks a 6-digit OTP verification code:
 * Completely hides the code or displays only the first digit and 5 bullets.
 * Example: "542109" -> "5•••••"
 */
export function maskOtp(otp: string | undefined | null): string {
  if (!otp) return '••••••';
  const clean = String(otp).trim();
  if (clean.length <= 1) return '••••••';
  return clean.charAt(0) + '•••••';
}
