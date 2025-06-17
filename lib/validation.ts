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

/**
 * Validates a name (first name, last name)
 * Should contain only alphabets, spaces, hyphens, and apostrophes
 * Minimum 2 characters, maximum 50 characters
 * @param name The name to validate
 * @returns Boolean indicating if the name is valid
 */
export function isValidName(name: string): boolean {
  if (!name || name.trim().length < 2 || name.trim().length > 50) {
    return false
  }
  const nameRegex = /^[a-zA-Z\s'-]+$/
  return nameRegex.test(name)
}

/**
 * Validates if a job role/description is valid
 * Should be between 3 and 100 characters
 * @param role The job role to validate
 * @returns Boolean indicating if the job role is valid
 */
export function isValidJobRole(role: string): boolean {
  if (!role) return true // Job role is optional
  return role.trim().length >= 3 && role.trim().length <= 100
}

/**
 * Validates if a string is not empty and has a minimum length
 * @param value The string to validate
 * @param minLength The minimum required length
 * @returns Boolean indicating if the string is valid
 */
export function isNotEmpty(value: string, minLength: number = 1): boolean {
  return !!value && value.trim().length >= minLength
}
