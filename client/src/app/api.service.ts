import { Injectable, signal } from '@angular/core';
import { Board, BoardItem, RequestType, ResponseType, User } from './types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly user = signal<User | undefined>(undefined);
  readonly users = signal<User[]>([]);
  readonly boards = signal<Board[]>([
    { id: '1', name: 'Board 1', items: [], createdAt: Date.now() },
    { id: '2', name: 'Board 2', items: [], createdAt: Date.now() },
    { id: '3', name: 'Board 3', items: [], createdAt: Date.now() },
    { id: '4', name: 'Board 4', items: [], createdAt: Date.now() },
  ]);
  #ws: WebSocket | null = null;

  #setupConnection() {
    this.#ws = new WebSocket('ws://localhost:8000');
  }

  login(name: string) {
    this.#setupConnection();
    const request: RequestType = { type: 'user-add-request', payload: { name } };
    this.#ws?.addEventListener('open', () => {
      this.#ws?.send(JSON.stringify(request));
      this.#setupListeners();
    });
  }

  logout() {
    const request: RequestType = { type: 'user-remove-request', payload: { id: this.user()!.id } };
    this.#ws?.send(JSON.stringify(request));
    this.user.set(undefined);
    this.users.set([]);
  }

  addBoard(name: string) {
    const request: RequestType = { type: 'board-add-request', payload: { name } };
    this.#ws?.send(JSON.stringify(request));
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
    // this.boards.set(boards);
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
    const boards = this.boards();
    const boardIndex = boards.findIndex((board) => board.id === boardId);
    boards[boardIndex].items.push(item);
    this.boards.set(boards);
  }

  #handleBoardItemRemove(boardId: string, itemId: string) {
    const boards = this.boards();
    const boardIndex = boards.findIndex((board) => board.id === boardId);
    const itemIndex = boards[boardIndex].items.findIndex((item) => item.id === itemId);
    boards[boardIndex].items.splice(itemIndex, 1);
    this.boards.set(boards);
  }

  #handleBoardItemUpdate(boardId: string, item: BoardItem) {
    const boards = this.boards();
    const boardIndex = boards.findIndex((board) => board.id === boardId);
    const itemIndex = boards[boardIndex].items.findIndex((item) => item.id === item.id);
    boards[boardIndex].items[itemIndex] = item;
    this.boards.set(boards);
  }

  #handleLogout() {
    this.user.set(undefined);
    this.users.set([]);
    this.boards.set([]);
  }
}
