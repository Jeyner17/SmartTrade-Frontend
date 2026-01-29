import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/settings-page/settings-page.component')
      .then(m => m.SettingsPageComponent)
  }
];