import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BoardsListComponent } from './boards-list.component';
import { BoardComponent } from './board.component';
import { StateService } from './state.service';

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
      gap: 3px;

      .placeholder {
        flex: 1 1 auto;
        display: grid;
        place-content: center;
      }
    }
  `,
  template: `
    <ngx-boards-list />
    @if (state.hasSelectedBoard()) {
      <ngx-board [board]="state.selectedBoard()!" />
    } @else {
      <div class="placeholder">No board selected</div>
    }
  `,
})
export class BoardsComponent {
  protected readonly state = inject(StateService);
}
