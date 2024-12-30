import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BoardItemType, RequestType } from './types';

@Injectable({ providedIn: 'root' })
export class SenderService {
  #api = inject(ApiService);

  addBoard(name: string) {
    const request: RequestType = { type: 'board-add-request', payload: { name } };
    this.#api.send(request);
  }

  updateBoard(boardId: string, name: string) {
    const request: RequestType = { type: 'board-update-request', payload: { boardId, name } };
    this.#api.send(request);
  }

  removeBoard(boardId: string) {
    const request: RequestType = { type: 'board-remove-request', payload: { id: boardId } };
    this.#api.send(request);
  }

  addBoardItem(boardId: string, content: string, type: BoardItemType) {
    const request: RequestType = { type: 'board-item-add-request', payload: { boardId, content, type } };
    this.#api.send(request);
  }

  removeBoardItem(boardId: string, itemId: string) {
    const request: RequestType = { type: 'board-item-remove-request', payload: { boardId, itemId } };
    this.#api.send(request);
  }

  updateBoardItem(boardId: string, itemId: string, content?: string) {
    const request: RequestType = { type: 'board-item-update-request', payload: { boardId, itemId, content } };
    this.#api.send(request);
  }
}
