import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { StateService } from './state.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ngx-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styles: `
    :host {
      flex: auto;
      display: grid;
      place-content: center;
    }
  `,
  template: `
    <label for="name">Name:</label>
    <input name="name" type="text" [(ngModel)]="name" autocomplete="off" />
    <button (click)="login()" [disabled]="!hasName()">Login</button>
  `,
})
export class LoginComponent {
  #api = inject(StateService);
  protected readonly name = signal('');
  protected readonly hasName = computed(() => this.name().length > 0);

  login() {
    const id = localStorage.getItem('retro_user_id') ?? undefined;
    this.#api.login(this.name(), id);
  }
}
