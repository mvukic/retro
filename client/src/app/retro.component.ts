import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ApiService } from './api.service';
import { LoginComponent } from './login.component';
import { UsersComponent } from './user.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'ngx-retro-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginComponent, UsersComponent, HeaderComponent],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 5px;
      overflow: hidden;
      height: 100%;
    }
  `,
  template: `
    <div>
      <h1 style="text-align: center">Retrospective</h1>
    </div>
    <ngx-header />
    <ngx-users />
    @if (api.user()) {
      <input type="text" #boardInput />
      <button (click)="addBoard(boardInput.value)">Add board</button>
    } @else {
      <ngx-login />
    }
  `,
})
export class RetroComponent {
  readonly api = inject(ApiService);

  addBoard(name: string) {
    this.api.addBoard(name);
  }
}
