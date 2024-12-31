import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { StateService } from './state.service';
import { BoardItem } from './types';
import { FormsModule } from '@angular/forms';
import { SenderService } from './sender.service';
import { BoardItemVoteComponent } from './board-item-vote.component';

@Component({
  selector: 'ngx-board-item-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTextareaAutosize, FormsModule, BoardItemVoteComponent],
  styles: `
    :host {
      display: flex;
      flex-direction: column;

      > div {
        display: flex;
        flex-direction: row;
        textarea {
          width: 100%;
          resize: vertical;
          overflow-y: auto;
        }

        .actions {
          display: flex;
          flex-direction: column;
          width: 80px;
        }
      }
    }
  `,
  template: `
    <div>
      <textarea
        cdkTextareaAutosize
        cdkAutosizeMinRows="5"
        cdkAutosizeMaxRows="10"
        placeholder="Add content ..."
        [(ngModel)]="copy().content"
      ></textarea>
      <div class="actions">
        <button (click)="update()">Update</button>
        <button (click)="delete()">Delete</button>
        <div style="flex: 1"></div>
      </div>
    </div>
    <ngx-board-item-vote [boardId]="boardId" [itemId]="item().id" [votes]="item().votes" [voterIds]="item().voterIds" />
  `,
})
export class BoardItemEditComponent {
  #sender = inject(SenderService);
  #state = inject(StateService);
  protected readonly boardId = this.#state.selectedBoardId()!;

  readonly item = input.required<BoardItem>();
  readonly copy = linkedSignal(this.item);

  update() {
    this.#sender.updateBoardItem(this.boardId, this.item().id, this.copy().content);
  }

  delete() {
    this.#sender.removeBoardItem(this.boardId, this.item().id);
  }
}
