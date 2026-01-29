/**
 * Modelos de Configuración
 * Sistema de Gestión Comercial - Módulo Settings
 */

export interface CompanyConfig {
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  logo: string | null;
}

export interface FiscalConfig {
  country: string;
  currency: string;
  taxRegime: string;
  ivaPercentage: number;
}

export interface BusinessConfig {
  minStock: number;
  defaultCreditDays: number;
  maxDiscountPercentage: number;
}

export interface TechnicalConfig {
  sessionTimeoutMinutes: number;
  logRetentionDays: number;
  dateFormat: string;
  timeFormat: string;
}

export interface BackupConfig {
  enabled: boolean;
  frequency: string;
  time: string;
  nextBackup?: string | null;
}

export interface SystemConfiguration {
  company: CompanyConfig;
  fiscal: FiscalConfig;
  business: BusinessConfig;
  technical: TechnicalConfig;
  backup: BackupConfig;
}

export interface ConfigurationResponse {
  type: string;
  data: any;
  lastUpdated: string;
}