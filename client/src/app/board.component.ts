import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Board } from './types';
import { BoardItemsComponent } from './board-items.component';

@Component({
  selector: 'ngx-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardItemsComponent],
  styles: `
    :host {
      flex: 1 1 auto;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 3px;
      > div {
        display: flex;
        flex-direction: column;
        > h2 {
          text-align: center;
        }
        > ngx-board-items {
          flex: 1 1 auto;
        }
      }
    }
  `,
  template: `
    <div>
      <h2>Keep doing</h2>
      <ngx-board-items [items]="keepDoings()" type="keepDoing" />
    </div>
    <div>
      <h2>Improvements</h2>
      <ngx-board-items [items]="improvements()" type="improvement" />
    </div>
    <div>
      <h2>Action points</h2>
      <ngx-board-items [items]="actionPoints()" type="actionPoint" />
    </div>
  `,
})
export class BoardComponent {
  readonly board = input.required<Board>();

  readonly improvements = computed(() =>
    this.board()
      .items.filter((i) => i.type === 'improvement')
      .sort((a, b) => b.createdAt - a.createdAt),
  );
  readonly keepDoings = computed(() =>
    this.board()
      .items.filter((i) => i.type === 'keepDoing')
      .sort((a, b) => b.createdAt - a.createdAt),
  );
  readonly actionPoints = computed(() =>
    this.board()
      .items.filter((i) => i.type === 'actionPoint')
      .sort((a, b) => b.createdAt - a.createdAt),
  );
}
