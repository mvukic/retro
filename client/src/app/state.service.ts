import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Board,
  BoardAddResponse,
  BoardItemAddResponse,
  BoardItemRemoveResponse,
  BoardItemUpdateResponse,
  BoardItemVoteResponse,
  BoardRemoveResponse,
  BoardUpdateResponse,
  ResponseType,
  User,
  UserAddResponseAllResponse,
  UserAddResponseCurrentResponse,
  UserRemoveResponse,
} from './types';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class StateService {
  #api = inject(ApiService);
  readonly user = signal<User | undefined>(undefined);
  readonly hasUser = computed(() => !!this.user());
  readonly users = signal<User[]>([]);

  readonly boards = signal<Board[]>([]);
  readonly selectedBoardId = signal<string | undefined>(undefined);
  readonly selectedBoard = computed(() => this.boards().find((b) => b.id === this.selectedBoardId()));
  readonly hasSelectedBoard = computed(() => !!this.selectedBoard());

  login(name: string) {
    this.#api.connect();
    this.#api.onOpen(() => {
      this.#api.send({ type: 'user-add-request', payload: { name } });
      this.#setupListeners();
    });
  }

  #setupListeners() {
    const handlers = {
      'user-add-response-all-response': this.#handleAddUserAll.bind(this),
      'user-add-response-current-response': this.#handleAddUserCurrent.bind(this),
      'user-remove-response': this.#handleUserRemove.bind(this),
      'board-add-response': this.#handleBoardAdd.bind(this),
      'board-update-response': this.#handleBoardUpdate.bind(this),
      'board-remove-response': this.#handleBoardRemove.bind(this),
      'board-item-add-response': this.#handleBoardItemAdd.bind(this),
      'board-item-remove-response': this.#handleBoardItemRemove.bind(this),
      'board-item-update-response': this.#handleBoardItemUpdate.bind(this),
      'board-item-vote-response': this.#handleBoardItemVote.bind(this),
    } as const;
    this.#api.onMessage((event) => {
      const data = JSON.parse(event.data) as ResponseType;
      // @ts-ignore
      handlers[data.type](data);
    });
    this.#api.onClose(() => this.#handleClose());
  }

  #handleAddUserAll(event: UserAddResponseAllResponse) {
    const { id, name } = event.payload;
    this.users.update((users) => [...users, { id, name }]);
  }

  #handleAddUserCurrent(event: UserAddResponseCurrentResponse) {
    const { id, name, users, boards } = event.payload;
    this.user.set({ id, name });
    this.users.set(users);
    this.boards.set(boards);
  }

  #handleUserRemove(event: UserRemoveResponse) {
    const { id } = event.payload;
    this.users.update((users) => users.filter((user) => user.id !== id));
  }

  #handleBoardAdd(event: BoardAddResponse) {
    const { board } = event.payload;
    this.boards.update((boards) => [...boards, board]);
  }

  #handleBoardUpdate(event: BoardUpdateResponse) {
    const { boardId, name } = event.payload;
    this.boards.update((boards) => boards.map((board) => (board.id === boardId ? { ...board, name } : board)));
  }

  #handleBoardRemove(event: BoardRemoveResponse) {
    const { id } = event.payload;
    this.boards.update((boards) => boards.filter((board) => board.id !== id));
  }

  #handleBoardItemAdd(event: BoardItemAddResponse) {
    const { boardId, item } = event.payload;
    this.boards.update((boards) => {
      return boards.map((board) => {
        if (board.id === boardId) {
          return { ...board, items: [...board.items, item] };
        } else {
          return board;
        }
      });
    });
  }

  #handleBoardItemRemove(event: BoardItemUpdateResponse) {
    const { boardId, itemId } = event.payload;
    this.boards.update((boards) => {
      return boards.map((board) => {
        if (board.id === boardId) {
          return { ...board, items: board.items.filter((item) => item.id !== itemId) };
        } else {
          return board;
        }
      });
    });
  }

  #handleBoardItemUpdate(event: BoardItemRemoveResponse) {
    const { boardId, item: updatedItem } = event.payload;
    this.boards.update((boards) => {
      return boards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            items: board.items.map((item) => {
              if (item.id === updatedItem.id) {
                return { ...item, content: updatedItem.content };
              } else {
                return item;
              }
            }),
          };
        } else {
          return board;
        }
      });
    });
  }

  #handleBoardItemVote(event: BoardItemVoteResponse) {
    const { boardId, itemId, votes } = event.payload;
    this.boards.update((boards) => {
      return boards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            items: board.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, votes };
              } else {
                return item;
              }
            }),
          };
        } else {
          return board;
        }
      });
    });
  }

  #handleClose() {
    this.user.set(undefined);
    this.users.set([]);
    this.boards.set([]);
  }
}
