// Accepts Bangladeshi mobile numbers in local or international format.
export function isValidPhone(phone: string): boolean {
  return /^(?:01\d{9}|\+?8801\d{9})$/.test(phone)
}
