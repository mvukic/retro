import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateService } from './state.service';
import { DialogRef } from '@angular/cdk/dialog';

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
    <input type="text" name="name" [(ngModel)]="name" />
    <div class="actions">
      <button (click)="create()" [disabled]="name().length === 0">Save</button>
      <button (click)="ref.close()">Close</button>
    </div>
  `,
})
export class BoardCreateDialog {
  #state = inject(StateService);
  protected readonly ref = inject(DialogRef);

  protected readonly name = signal('');

  protected create() {
    this.#state.addBoard(this.name());
    this.ref.close();
  }
}
