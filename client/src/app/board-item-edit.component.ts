import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { StateService } from './state.service';
import { BoardItem } from './types';

@Component({
  selector: 'ngx-board-item-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTextareaAutosize],
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
    <textarea cdkTextareaAutosize cdkAutosizeMinRows="5" cdkAutosizeMaxRows="10" placeholder="Add content ..."> {{ item()!.content }}</textarea>
    <div class="actions">
      <button (click)="save()">Save</button>
      <button (click)="delete()">Delete</button>
    </div>
  `,
})
export class BoardItemEditComponent {
  #state = inject(StateService);
  #boardId = this.#state.selectedBoardId()!;

  readonly item = input.required<BoardItem>();

  save() {
    this.#state.updateBoardItem(this.#boardId, this.item()!.id, this.item().content);
  }

  delete() {
    this.#state.removeBoardItem(this.#boardId, this.item()!.id);
  }
}
