import { ChangeDetectionStrategy, Component, inject, Input, input } from '@angular/core';
import { ApiService } from './api.service';
import { User } from './types';

@Component({
  selector: 'ngx-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      border: 1px solid black;
      border-radius: 20px;
      min-width: 60px;
      text-align: center;
      &.is-current-user {
        background-color: lightgreen;
      }
    }
  `,
  host: {
    '[attr.title]': 'user().id',
    '[class.is-current-user]': 'isCurrentUser()',
  },
  template: `{{ user().name }}`,
})
export class UserComponent {
  readonly user = input.required<User>();
  readonly isCurrentUser = input<boolean>(false);
}

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
  protected api = inject(ApiService);
}
