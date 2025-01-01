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
  `,
  template: `
    Users:
    @for (user of api.users(); track user.id) {
      <ngx-user [user]="user" [isCurrentUser]="api.user()?.id === user.id" />
    }
  `,
})
export class UsersComponent {
  protected api = inject(StateService);
}
