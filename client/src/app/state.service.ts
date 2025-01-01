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
  UserUpdateResponseAllResponse,
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

  login(name: string, id?: string) {
    this.#api.connect();
    this.#api.onOpen(() => {
      this.#setupListeners();
      this.#api.send({ type: 'user-add-request', payload: { name, id } });
    });
  }

  #setupListeners() {
    const handlers = {
      'user-add-response-all-response': this.#handleAddUserAll.bind(this),
      'user-add-response-current-response': this.#handleAddUserCurrent.bind(this),
      'user-update-response-all-response': this.#handleUpdateUserAll.bind(this),
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
    this.#api.onError((e) => this.#handleError(e));
  }

  #handleAddUserAll(event: UserAddResponseAllResponse) {
    const { id, name } = event.payload;
    if (!this.users().some((user) => user.id === id)) {
      this.users.update((users) => [...users, { id, name }]);
    }
  }

  #handleAddUserCurrent(event: UserAddResponseCurrentResponse) {
    const { id, name, users, boards } = event.payload;
    this.user.set({ id, name });
    this.users.set(users);
    this.boards.set(boards);
    localStorage.setItem('retro_user_id', id);
    localStorage.setItem('retro_user_name', name);
  }

  #handleUpdateUserAll(event: UserUpdateResponseAllResponse) {
    const { id, name } = event.payload;
    this.users.update((users) => users.map((user) => (user.id === id ? { id, name } : user)));
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
    const { boardId, itemId, votes, voterIds } = event.payload;
    this.boards.update((boards) => {
      return boards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            items: board.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, votes, voterIds };
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

  #handleError(event: Event) {
    console.error(event);
    this.#handleClose();
  }
}
