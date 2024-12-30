import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { SenderService } from './sender.service';

@Component({
  selector: 'ngx-board-create-dialog',
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
    <input type="text" name="name" [(ngModel)]="name" autocomplete="off" />
    <div class="actions">
      <button (click)="create()" [disabled]="name().length === 0">Save</button>
      <button (click)="ref.close()">Close</button>
    </div>
  `,
})
export class BoardCreateDialog {
  #sender = inject(SenderService);
  protected readonly ref = inject(DialogRef);

  protected readonly name = signal('');

  protected create() {
    this.#sender.addBoard(this.name());
    this.ref.close();
  }
}
