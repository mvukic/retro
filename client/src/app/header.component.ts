import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsersComponent } from './user.component';

@Component({
  selector: 'ngx-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ngx-users />`,
  imports: [UsersComponent],
})
export class HeaderComponent {}
