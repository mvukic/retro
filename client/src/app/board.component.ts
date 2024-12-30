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
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .columns {
        flex: 1 1 auto;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 3px;
        > div {
          display: flex;
          flex-direction: column;
          > h3 {
            text-align: center;
          }
          > ngx-board-items {
            flex: 1 1 auto;
          }
        }
      }
    }
  `,
  template: `
    <div>
      <h2 style="text-align: center; margin: 0">{{ board().name }}</h2>
    </div>
    <div class="columns">
      <div>
        <h3>Keep doing</h3>
        <ngx-board-items [items]="keepDoings()" type="keepDoing" />
      </div>
      <div>
        <h3>Improvements</h3>
        <ngx-board-items [items]="improvements()" type="improvement" />
      </div>
      <div>
        <h3>Action points</h3>
        <ngx-board-items [items]="actionPoints()" type="actionPoint" />
      </div>
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
