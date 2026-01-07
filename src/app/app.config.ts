import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';

import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),

  // 啟用 HttpClient + 自訂 Interceptor
    provideHttpClient(
      withInterceptors([apiUrlInterceptor])
    ),
    { provide: LOCALE_ID, useValue: 'zh' },
  ]
};
