

export const PASSWORD_REGEX = /^.{8},}$/; // Minimum 8 characters
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/; // Alphanumeric and underscores, 3-20 characters

const saltRounds = 10;

import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
}


export const compareHash = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
}

export const encryptText = (text: string): string => {
  // Simple base64 encoding for demonstration (not secure)
  return Buffer.from(text).toString('base64');
}

export const decryptText = (encodedText: string): string => {
  return Buffer.from(encodedText, 'base64').toString('utf-8');
}

export const isValidPassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
}

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
}

export const isValidUsername = (username: string): boolean => {
  return USERNAME_REGEX.test(username);
}
