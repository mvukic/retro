import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateService } from './state.service';
import { UserComponent } from './user.component';

@Component({
  selector: 'ngx-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserComponent],
  styles: `
    :host {
      display: flex;
      flex-direction: row;
      gap: 5px;
    }

    ngx-user {
      animation: show 600ms 100ms cubic-bezier(0.38, 0.97, 0.56, 0.76) forwards;
      opacity: 0;
      transform: rotateY(-90deg);
      transform-origin: top center;
    }

    @keyframes show {
      100% {
        opacity: 1;
        transform: none;
      }
    }
  `,
  template: `
    <span>Users:</span>
    @for (user of api.users(); track user.id) {
      <ngx-user [user]="user" [isCurrentUser]="api.user()?.id === user.id" />
    }
  `,
})
export class UsersComponent {
  protected api = inject(StateService);
}
