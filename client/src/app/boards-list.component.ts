import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { StateService } from './state.service';
import { Dialog } from '@angular/cdk/dialog';
import { BoardCreateDialog } from './board-create-dialog.component';
import { Board } from './types';
import { BoardEditDialog } from './board-edit-dialog.component';

@Component({
  selector: 'ngx-boards-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
      width: 200px;
    }
    .items {
      display: flex;
      flex-direction: column;
      gap: 3px;
      overflow-y: auto;
      .item {
        display: flex;
        flex-direction: row;
        gap: 3px;
        > span.selected {
          background-color: #ccc;
        }
        &:hover {
          cursor: pointer;
          background-color: #ccc;
        }
      }
    }
  `,
  template: `
    <button (click)="addBoard()">Add board</button>
    <div class="items">
      @for (board of boards(); track board.id) {
        <div class="item">
          <span style="flex: auto" (click)="state.selectedBoardId.set(board.id)" [class.selected]="board.id === state.selectedBoardId()">
            {{ board.name }}
          </span>
          <button (click)="editBoard(board)">Edit</button>
        </div>
      }
    </div>
  `,
})
export class BoardsListComponent {
  #dialog = inject(Dialog);
  protected readonly state = inject(StateService);
  protected boards = computed(() => this.state.boards().toSorted((a, b) => b.createdAt - a.createdAt));

  addBoard() {
    this.#dialog.open(BoardCreateDialog);
  }

  editBoard(board: Board) {
    this.#dialog.open(BoardEditDialog, { data: board });
  }
}
