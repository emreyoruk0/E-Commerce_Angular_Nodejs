import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
      provideHttpClient(),
      provideRouter(routes),
      provideClientHydration(),
      importProvidersFrom(
        BrowserModule,
        CommonModule,
        RouterModule
      )
    ]
};
