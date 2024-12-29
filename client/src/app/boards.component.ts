import { ApiService } from './api.service';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Board } from './types';

@Component({
  selector: 'ngx-boards-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 2px;
      border: 1px solid red;
      overflow-y: scroll;
    }
    .item {
      padding: 3px;
      &:hover {
        cursor: pointer;
        background-color: #ccc;
      }
    }
  `,
  template: `
    @for (board of api.boards(); track board.id) {
      <div class="item" (click)="selected.emit(board)">{{ board.name }}</div>
    }
  `,
})
export class BoardsListComponent {
  protected readonly api = inject(ApiService);

  readonly selected = output<Board>();
}

@Component({
  selector: 'ngx-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      flex: 1 1 auto;
      border: 1px solid red;
    }
  `,
  template: ` <span>{{ board().name }}</span> `,
})
export class BoardComponent {
  protected readonly api = inject(ApiService);

  readonly board = input.required<Board>();
}

@Component({
  selector: 'ngx-boards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardsListComponent, BoardComponent],
  styles: `
    :host {
      flex: 1 1 auto;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      border: 1px solid red;
    }
  `,
  template: `
    <ngx-boards-list (selected)="board.set($event)" />
    @if (board()) {
      <ngx-board [board]="board()!" />
    } @else {
      <span>No board selected</span>
    }
  `,
})
export class BoardsComponent {
  protected readonly board = signal<Board | undefined>(undefined);
}
