

export const trim = (value: string): string => value.trim();


export const collapseWhitespace = (value: string): string => value.trim().replace(/\s+/g, ' ');


export const normalizeEmail = (value: string): string => value.trim().toLowerCase();


export const normalizePhone = (value: string): string =>
  value.trim().replace(/(?!^\+)[^\d]/g, '');
