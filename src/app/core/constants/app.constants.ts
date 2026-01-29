/**
 * Constantes de la Aplicación
 * Sistema de Gestión Comercial
 */

export const APP_CONSTANTS = {
  APP_NAME: 'Sistema de Gestión Comercial',
  VERSION: '1.0.0',
  
  // Archivos
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/jpg'],
  
  // Validación
  RUC_MIN_LENGTH: 10,
  RUC_MAX_LENGTH: 13,
  PHONE_MIN_LENGTH: 7,
  PHONE_MAX_LENGTH: 20,
  
  // UI
  TOAST_DURATION: 3000,
  DEBOUNCE_TIME: 300
};

export const COUNTRIES = {
  EC: 'Ecuador',
  CO: 'Colombia',
  PE: 'Perú',
  US: 'Estados Unidos',
  MX: 'México'
} as const;

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'Dólar estadounidense' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  COP: { code: 'COP', symbol: '$', name: 'Peso colombiano' },
  PEN: { code: 'PEN', symbol: 'S/', name: 'Sol peruano' },
  MXN: { code: 'MXN', symbol: '$', name: 'Peso mexicano' }
} as const;

export const TAX_REGIMES = [
  'Régimen General',
  'Régimen Simplificado',
  'RISE',
  'Régimen Popular'
] as const;

export const BACKUP_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
} as const;

export const DATE_FORMATS = {
  'DD/MM/YYYY': 'DD/MM/YYYY',
  'MM/DD/YYYY': 'MM/DD/YYYY',
  'YYYY-MM-DD': 'YYYY-MM-DD'
} as const;

export const TIME_FORMATS = {
  '12H': '12h',
  '24H': '24h'
} as const;