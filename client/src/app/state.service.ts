import { computed, Injectable, signal } from '@angular/core';
import { Board, BoardItem, BoardItemType, RequestType, ResponseType, User } from './types';

@Injectable({ providedIn: 'root' })
export class StateService {
  readonly user = signal<User | undefined>(undefined);
  readonly hasUser = computed(() => !!this.user());
  readonly users = signal<User[]>([]);

  readonly boards = signal<Board[]>([]);
  readonly selectedBoardId = signal<string | undefined>(undefined);
  readonly selectedBoard = computed(() => this.boards().find((b) => b.id === this.selectedBoardId()));
  readonly hasSelectedBoard = computed(() => !!this.selectedBoard());

  #ws: WebSocket | null = null;

  #setupConnection() {
    this.#ws = new WebSocket('ws://localhost:8000');
  }

  login(name: string) {
    this.#setupConnection();
    const request: RequestType = { type: 'user-add-request', payload: { name } };
    this.#ws?.addEventListener('open', () => {
      this.#send(request);
      this.#setupListeners();
    });
  }

  addBoard(name: string) {
    const request: RequestType = { type: 'board-add-request', payload: { name } };
    this.#send(request);
  }

  updateBoard(boardId: string, name: string) {
    const request: RequestType = { type: 'board-update-request', payload: { boardId, name } };
    this.#send(request);
  }

  removeBoard(boardId: string) {
    const request: RequestType = { type: 'board-remove-request', payload: { id: boardId } };
    this.#send(request);
  }

  addBoardItem(boardId: string, content: string, type: BoardItemType) {
    const request: RequestType = { type: 'board-item-add-request', payload: { boardId, content, type } };
    this.#send(request);
  }

  removeBoardItem(boardId: string, itemId: string) {
    const request: RequestType = { type: 'board-item-remove-request', payload: { boardId, itemId } };
    this.#send(request);
  }

  updateBoardItem(boardId: string, itemId: string, content?: string) {
    const request: RequestType = { type: 'board-item-update-request', payload: { boardId, itemId, content } };
    this.#send(request);
  }

  #setupListeners() {
    this.#ws?.addEventListener('message', (event) => {
      const data = JSON.parse(event.data) as ResponseType;
      switch (data.type) {
        case 'user-add-response-all-response':
          this.#handleAddUserAll(data.payload.id, data.payload.name);
          break;
        case 'user-add-response-current-response':
          this.#handleAddUserCurrent(data.payload.id, data.payload.name, data.payload.users, data.payload.boards);
          break;
        case 'user-remove-response':
          this.#handleUserRemove(data.payload.id);
          break;
        case 'board-add-response':
          this.#handleBoardAdd(data.payload.board);
          break;
        case 'board-update-response':
          this.#handleBoardUpdate(data.payload.boardId, data.payload.name);
          break;
        case 'board-remove-response':
          this.#handleBoardRemove(data.payload.id);
          break;
        case 'board-item-add-response':
          this.#handleBoardItemAdd(data.payload.boardId, data.payload.item);
          break;
        case 'board-item-remove-response':
          this.#handleBoardItemRemove(data.payload.boardId, data.payload.itemId);
          break;
        case 'board-item-update-response':
          this.#handleBoardItemUpdate(data.payload.boardId, data.payload.item);
          break;
      }
    });
    this.#ws?.addEventListener('close', () => {
      this.#handleLogout();
    });
  }

  #handleAddUserAll(id: string, name: string) {
    this.users.update((users) => [...users, { id, name }]);
  }

  #handleAddUserCurrent(id: string, name: string, users: User[], boards: Board[]) {
    this.user.set({ id, name });
    this.users.set(users);
    this.boards.set(boards);
  }

  #handleUserRemove(id: string) {
    this.users.update((users) => users.filter((user) => user.id !== id));
  }

  #handleBoardAdd(board: Board) {
    this.boards.update((boards) => [...boards, board]);
  }

  #handleBoardUpdate(boardId: string, name: string) {
    this.boards.update((boards) => boards.map((board) => (board.id === boardId ? { ...board, name } : board)));
  }

  #handleBoardRemove(id: string) {
    this.boards.update((boards) => boards.filter((board) => board.id !== id));
  }

  #handleBoardItemAdd(boardId: string, item: BoardItem) {
    this.boards.update((boards) => {
      return boards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            items: [...board.items, item],
          };
        } else {
          return board;
        }
      });
    });
  }

  #handleBoardItemRemove(boardId: string, itemId: string) {
    this.boards.update((boards) => {
      return boards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            items: board.items.filter((item) => item.id !== itemId),
          };
        } else {
          return board;
        }
      });
    });
  }

  #handleBoardItemUpdate(boardId: string, updatedItem: BoardItem) {
    this.boards.update((boards) => {
      return boards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            items: board.items.map((item) => {
              if (item.id === updatedItem.id) {
                return {
                  ...item,
                  content: updatedItem.content,
                };
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

  #handleLogout() {
    this.user.set(undefined);
    this.users.set([]);
    this.boards.set([]);
  }

  #send(request: RequestType) {
    this.#ws?.send(JSON.stringify(request));
  }
}
