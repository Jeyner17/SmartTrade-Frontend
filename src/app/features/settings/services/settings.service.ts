/**
 * Servicio de Configuración
 * Sistema de Gestión Comercial - Módulo Settings
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { ApiResponse } from '../../../core/models/api-response.model';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import {
  SystemConfiguration,
  ConfigurationResponse,
  BackupConfig
} from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpService: HttpService) {}

  /**
   * Obtener toda la configuración del sistema
   */
  getAllConfiguration(): Observable<ApiResponse<SystemConfiguration>> {
    return this.httpService.get<ApiResponse<SystemConfiguration>>(
      API_CONSTANTS.ENDPOINTS.SETTINGS.BASE
    );
  }

  /**
   * Obtener configuración por tipo
   */
  getConfigurationByType(type: string): Observable<ApiResponse<ConfigurationResponse>> {
    return this.httpService.get<ApiResponse<ConfigurationResponse>>(
      API_CONSTANTS.ENDPOINTS.SETTINGS.BY_TYPE(type)
    );
  }

  /**
   * Actualizar configuración completa
   */
  updateConfiguration(config: Partial<SystemConfiguration>): Observable<ApiResponse<any>> {
    return this.httpService.put<ApiResponse<any>>(
      API_CONSTANTS.ENDPOINTS.SETTINGS.BASE,
      config
    );
  }

  /**
   * Actualizar configuración por tipo
   */
  updateConfigurationByType(type: string, data: any): Observable<ApiResponse<any>> {
    return this.httpService.put<ApiResponse<any>>(
      API_CONSTANTS.ENDPOINTS.SETTINGS.BY_TYPE(type),
      data
    );
  }

  /**
   * Subir logo de la empresa
   */
  uploadLogo(file: File): Observable<ApiResponse<any>> {
    return this.httpService.uploadFile<ApiResponse<any>>(
      API_CONSTANTS.ENDPOINTS.SETTINGS.LOGO,
      file,
      'logo'
    );
  }

  /**
   * Configurar backups automáticos
   */
  configureBackups(config: BackupConfig): Observable<ApiResponse<any>> {
    return this.httpService.post<ApiResponse<any>>(
      API_CONSTANTS.ENDPOINTS.SETTINGS.BACKUP,
      config
    );
  }

  /**
   * Obtener parámetros técnicos
   */
  getTechnicalParameters(): Observable<ApiResponse<any>> {
    return this.httpService.get<ApiResponse<any>>(
      API_CONSTANTS.ENDPOINTS.SETTINGS.TECHNICAL
    );
  }
}