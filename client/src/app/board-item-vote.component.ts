import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SenderService } from './sender.service';
import { StateService } from './state.service';

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
    <div class="votes" [title]="voters()">{{ votes() }}</div>
    <button (click)="vote('up')" [disabled]="!canUpVote()">&uarr;</button>
    <button (click)="vote('down')" [disabled]="!canDownVote()">&darr;</button>
  `,
})
export class BoardItemVoteComponent {
  #sender = inject(SenderService);
  #state = inject(StateService);

  readonly votes = input.required<number>();
  readonly voterIds = input.required<string[]>();
  readonly boardId = input.required<string>();
  readonly itemId = input.required<string>();

  protected readonly canDownVote = computed(() => this.voterIds().includes(this.#state.user()!.id));
  protected readonly canUpVote = computed(() => !this.canDownVote());
  protected readonly voters = computed(() =>
    this.#state
      .users()
      .filter((u) => this.voterIds().includes(u.id))
      .map((user) => user.name)
      .join(','),
  );

  protected vote(vote: 'up' | 'down') {
    this.#sender.voteBoardItem(this.boardId(), this.itemId(), vote, this.#state.user()!.id);
  }
}
