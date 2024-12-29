import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'ngx-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (api.user()) {
      <button (click)="logout()">Logout</button>
    }
  `,
})
export class HeaderComponent {
  protected readonly api = inject(ApiService);

  logout() {
    this.api.logout();
  }
}
