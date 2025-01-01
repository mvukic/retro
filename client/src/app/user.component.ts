import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
      padding: 0 5px;

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
