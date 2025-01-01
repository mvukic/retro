import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { BoardItemsComponent } from './board-items.component';
import { BoardItem, BoardItemType } from './types';

@Component({
  selector: 'ngx-board-items-by-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardItemsComponent],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      > .sorting {
        display: flex;
        flex-direction: row;
      }
      > h3 {
        text-align: center;
      }
      > ngx-board-items {
        flex: 1 1 auto;
      }
    }
  `,
  template: `
    <h3>{{ label() }}</h3>
    <div class="sorting">
      <button (click)="sortingFn.set(sortByVotes)">Sort by Votes</button>
      <button (click)="sortingFn.set(sortByCreatedAt)">Sort by Created at</button>
    </div>
    <ngx-board-items [items]="sortedItems()" [type]="type()" />
  `,
})
export class BoardItemsByTypeComponent {
  readonly type = input.required<BoardItemType>();
  readonly items = input.required<BoardItem[]>();

  protected readonly sortedItems = computed(() => this.items().toSorted(this.sortingFn()));

  protected readonly label = computed(() => {
    switch (this.type()) {
      case 'keepDoing':
        return 'Keep doing';
      case 'improvement':
        return 'Improvements';
      case 'actionPoint':
        return 'Action points';
    }
  });

  protected readonly sortByCreatedAt = (a: BoardItem, b: BoardItem) => b.createdAt - a.createdAt;
  protected readonly sortByVotes = (a: BoardItem, b: BoardItem) => b.votes - a.votes;

  protected readonly sortingFn = signal<(a: BoardItem, b: BoardItem) => number>(this.sortByCreatedAt);
}
