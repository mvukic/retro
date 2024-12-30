import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { StateService } from './state.service';
import { BoardItem } from './types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ngx-board-item-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTextareaAutosize, FormsModule],
  styles: `
    :host {
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
  `,
  template: `
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
    </div>
  `,
})
export class BoardItemEditComponent {
  #state = inject(StateService);
  #boardId = this.#state.selectedBoardId()!;

  readonly item = input.required<BoardItem>();
  readonly copy = linkedSignal(this.item);

  update() {
    this.#state.updateBoardItem(this.#boardId, this.item().id, this.copy().content);
  }

  delete() {
    this.#state.removeBoardItem(this.#boardId, this.item()!.id);
  }
}
