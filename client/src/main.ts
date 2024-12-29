import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RetroComponent } from './app/retro.component';

bootstrapApplication(RetroComponent, appConfig).catch((err) => console.error(err));
