/**
 * Constantes de API
 * Sistema de Gestión Comercial
 */

export const API_CONSTANTS = {
  BASE_URL: '/api/v1',
  ENDPOINTS: {
    SETTINGS: {
      BASE: '/settings',
      BY_TYPE: (type: string) => `/settings/${type}`,
      LOGO: '/settings/logo',
      BACKUP: '/settings/backup/configure',
      TECHNICAL: '/settings/technical/parameters',
      HEALTH: '/settings/health'
    }
  },
  TIMEOUT: 30000
};

export const CONFIG_TYPES = {
  COMPANY: 'company',
  FISCAL: 'fiscal',
  BUSINESS: 'business',
  TECHNICAL: 'technical',
  BACKUP: 'backup'
} as const;

export type ConfigType = typeof CONFIG_TYPES[keyof typeof CONFIG_TYPES];