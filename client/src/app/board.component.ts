import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Board } from './types';
import { BoardItemColumnComponent } from './board-item-column.component';
import { ExportComponent } from './export.component';

@Component({
  selector: 'ngx-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardItemColumnComponent, ExportComponent],
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
      }
    }
  `,
  template: `
    <div>
      <h2 style="text-align: center; margin: 0">{{ board().name }}</h2>
    </div>
    <div style="display: flex; flex-direction: row-reverse;">
      <ngx-export />
    </div>
    <div class="columns">
      <ngx-board-items-column [type]="'keepDoing'" [items]="keepDoings()" />
      <ngx-board-items-column [type]="'improvement'" [items]="improvements()" />
      <ngx-board-items-column [type]="'actionPoint'" [items]="actionPoints()" />
    </div>
  `,
})
export class BoardComponent {
  readonly board = input.required<Board>();

  readonly improvements = computed(() => this.board().items.filter((i) => i.type === 'improvement'));
  readonly keepDoings = computed(() => this.board().items.filter((i) => i.type === 'keepDoing'));
  readonly actionPoints = computed(() => this.board().items.filter((i) => i.type === 'actionPoint'));
}
