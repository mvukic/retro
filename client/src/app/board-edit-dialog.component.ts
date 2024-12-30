import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateService } from './state.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Board } from './types';

@Component({
  selector: 'ngx-board-edit-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 5px;
      background-color: white;

      .actions {
        display: flex;
        gap: 5px;
      }
    }
  `,
  template: `
    <label for="name">Board name:</label>
    <input type="text" name="name" [(ngModel)]="name" />
    <div class="actions">
      <button (click)="update()" [disabled]="name().length === 0">Update</button>
      <button (click)="ref.close()">Close</button>
    </div>
  `,
})
export class BoardEditDialog {
  #state = inject(StateService);
  protected readonly ref = inject(DialogRef);
  protected readonly data = inject<Board>(DIALOG_DATA);

  protected readonly name = signal(this.data.name);

  protected update() {
    this.#state.updateBoard(this.data.id, this.name());
    this.ref.close();
  }
}
