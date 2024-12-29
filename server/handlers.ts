import {
  addBoard,
  addBoardItem,
  addUser,
  getUsers,
  removeBoard,
  removeBoardItem,
  removeUser,
  removeUserBySocket,
  updateBoard,
  updateBoardItem,
} from "./database.ts";
import { BoardItemType } from "./types.ts";
import { notifyAll, notifySingle } from "./notifiers.ts";

export function handleAddUser(socket: WebSocket, name: string) {
  const id = addUser(socket, name);
  notifyAll({ type: "user-add-response-all-response", payload: { id, name } });
  notifySingle(id, { type: "user-add-response-current-response", payload: { users: getUsers(), boards: [], id, name } });
}

export function handleRemoveUser(id: string) {
  removeUser(id);
  notifyAll({ type: "user-remove-response", payload: { id } });
}

export function handleAddBoard(name: string) {
  const board = addBoard(name);
  notifyAll({ type: "board-add-response", payload: { board } });
}

export function handleUpdateBoard(id: string, name: string) {
  updateBoard(id, name);
  notifyAll({ type: "board-update-response", payload: { boardId: id, name } });
}

export function handleRemoveBoard(id: string) {
  removeBoard(id);
  notifyAll({ type: "board-remove-response", payload: { id } });
}

export function handleAddBoardItem(boardId: string, content: string, type: BoardItemType) {
  const item = addBoardItem(boardId, content, type);
  notifyAll({ type: "board-item-add-response", payload: { boardId, item } });
}

export function handleRemoveBoardItem(boardId: string, itemId: string) {
  removeBoardItem(boardId, itemId);
  notifyAll({ type: "board-item-remove-response", payload: { boardId, itemId } });
}
export function handleUpdateBoardItem(boardId: string, itemId: string, content?: string, type?: BoardItemType) {
  const item = updateBoardItem(boardId, itemId, content, type);
  notifyAll({ type: "board-item-update-response", payload: { boardId, item } });
}

export function handleSocketClose(socket: WebSocket) {
  removeUserBySocket(socket);
}
