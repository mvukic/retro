import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Board } from './types';
import { SenderService } from './sender.service';

@Component({
  selector: 'ngx-board-edit-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styles: `
    :host {
      width: 300px;
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
      <button (click)="delete()" style="color: red">Delete</button>
      <div style="flex: auto"></div>
      <button (click)="update()" [disabled]="name().length === 0">Update</button>
      <button (click)="ref.close()">Close</button>
    </div>
  `,
})
export class BoardEditDialog {
  #sender = inject(SenderService);
  protected readonly ref = inject(DialogRef);
  protected readonly data = inject<Board>(DIALOG_DATA);

  protected readonly name = signal(this.data.name);

  protected update() {
    this.#sender.updateBoard(this.data.id, this.name());
    this.ref.close();
  }

  protected delete() {
    this.#sender.removeBoard(this.data.id);
    this.ref.close();
  }
}
