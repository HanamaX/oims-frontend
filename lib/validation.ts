/**
 * Validates an email address
 * @param email The email to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Validates a phone number in the format +[country code] [9 digits]
 * Example: +255 623302506
 * @param phone The phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  // Format should be: + followed by country code and 9 digits
  // Example: +255 623302506
  const phoneRegex = /^\+\d+\s\d{9}$/
  return phoneRegex.test(phone)
}
