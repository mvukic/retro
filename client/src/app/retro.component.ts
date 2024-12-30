import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateService } from './state.service';
import { LoginComponent } from './login.component';
import { HeaderComponent } from './header.component';
import { BoardsComponent } from './boards.component';

@Component({
  selector: 'ngx-retro-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginComponent, HeaderComponent, BoardsComponent],
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
    @if (state.hasUser()) {
      <ngx-header />
      <ngx-boards />
    } @else {
      <ngx-login />
    }
  `,
})
export class RetroComponent {
  readonly state = inject(StateService);
}
