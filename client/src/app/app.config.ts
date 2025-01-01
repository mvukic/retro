import { ApplicationConfig, inject, provideAppInitializer, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { StateService } from './state.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAppInitializer(() => {
      const name = localStorage.getItem('retro_user_name');
      const id = localStorage.getItem('retro_user_id');
      if (name && id) {
        inject(StateService).login(name, id);
      }
    }),
  ],
};
