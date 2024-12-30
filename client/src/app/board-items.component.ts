import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BoardItem, BoardItemType } from './types';
import { BoardItemCreateComponent } from './board-item-create.component';
import { BoardItemEditComponent } from './board-item-edit.component';

@Component({
  selector: 'ngx-board-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardItemEditComponent, BoardItemCreateComponent],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      gap: 5px;
    }
  `,
  template: `
    <ngx-board-item-create [type]="type()" />
    @for (item of items(); track item.id) {
      <ngx-board-item-edit [item]="item" />
    }
  `,
})
export class BoardItemsComponent {
  readonly items = input.required<BoardItem[]>();
  readonly type = input.required<BoardItemType>();
}
