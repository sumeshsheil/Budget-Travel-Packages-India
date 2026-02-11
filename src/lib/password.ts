import { randomBytes } from "crypto";

/**
 * Generate a cryptographically secure random password.
 *
 * Uses Node's crypto.randomBytes() instead of Math.random()
 * to ensure the generated password is unpredictable.
 */
export function generatePassword(length = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

  const bytes = randomBytes(length);
  let password = "";

  for (let i = 0; i < length; i++) {
    password += charset[bytes[i] % charset.length];
  }

  return password;
}
