import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SenderService } from './sender.service';

@Component({
  selector: 'ngx-board-item-vote',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      flex-direction: row;
      .votes {
        width: 25px;
        text-align: center;
      }
    }
  `,
  template: `
    <div class="votes">{{ votes() }}</div>
    <button (click)="vote('up')">&uarr;</button>
    <button (click)="vote('down')">&darr;</button>
  `,
})
export class BoardItemVoteComponent {
  #sender = inject(SenderService);

  readonly votes = input.required<number>();
  readonly boardId = input.required<string>();
  readonly itemId = input.required<string>();

  protected vote(vote: 'up' | 'down') {
    this.#sender.voteBoardItem(this.boardId(), this.itemId(), vote);
  }
}
