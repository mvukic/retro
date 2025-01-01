import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { User } from './types';
import { SenderService } from './sender.service';

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
        &:hover {
          border: 1px dashed black;
        }
      }
      input {
        background-color: lightgreen;
        border: none;
        &:focus {
          border: none;
          outline: none;
        }
      }
    }
  `,
  host: {
    '[attr.title]': 'user().id',
    '[class.is-current-user]': 'isCurrentUser()',
  },
  template: `
    @if (isCurrentUser()) {
      <input type="text" [value]="user().name" (change)="nameChange($any($event.target).value)" />
    } @else {
      {{ user().name }}
    }
  `,
})
export class UserComponent {
  #sender = inject(SenderService);
  readonly user = input.required<User>();
  readonly isCurrentUser = input<boolean>(false);

  nameChange(name: string) {
    this.#sender.updateUser(this.user().id, name);
    localStorage.setItem('retro_user_name', name);
  }
}
