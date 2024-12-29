import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'ngx-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      flex: auto;
      display: grid;
      place-content: center;
    }
  `,
  template: `
    <input type="text" #loginInput />
    <button (click)="login(loginInput.value)">Login</button>
  `,
})
export class LoginComponent {
  #api = inject(ApiService);

  login(name: string) {
    this.#api.login(name);
  }
}
