import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { BoardItem, BoardItemType } from './types';
import { StateService } from './state.service';
import { FormsModule } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'ngx-board-item-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CdkTextareaAutosize],
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
    <textarea cdkTextareaAutosize cdkAutosizeMinRows="5" cdkAutosizeMaxRows="10" placeholder="Add content ..." [(ngModel)]="content"></textarea>
    <div class="actions">
      <button (click)="save()">Save</button>
    </div>
  `,
})
export class BoardItemCreateComponent {
  #state = inject(StateService);
  #boardId = this.#state.selectedBoardId()!;

  readonly type = input.required<BoardItemType>();
  readonly item = input<BoardItem>();

  protected readonly content = signal('');

  save() {
    this.#state.addBoardItem(this.#boardId, this.content(), this.type());
  }
}
