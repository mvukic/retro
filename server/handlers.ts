import * as db from "./database.ts";
import { BoardItemType } from "./types.ts";
import { notifyAll, notifySingle } from "./notifiers.ts";

export function handleAddUser(socket: WebSocket, name: string) {
  const id = db.addUser(socket, name);
  notifyAll({ type: "user-add-response-all-response", payload: { id, name } });
  notifySingle(id, { type: "user-add-response-current-response", payload: { users: db.getUsers(), boards: db.getBoards(), id, name } });
}

export function handleAddBoard(name: string) {
  const board = db.addBoard(name);
  notifyAll({ type: "board-add-response", payload: { board } });
}

export function handleUpdateBoard(id: string, name: string) {
  db.updateBoard(id, name);
  notifyAll({ type: "board-update-response", payload: { boardId: id, name } });
}

export function handleRemoveBoard(id: string) {
  db.removeBoard(id);
  notifyAll({ type: "board-remove-response", payload: { id } });
}

export function handleAddBoardItem(boardId: string, content: string, type: BoardItemType) {
  const item = db.addBoardItem(boardId, content, type);
  notifyAll({ type: "board-item-add-response", payload: { boardId, item } });
}

export function handleRemoveBoardItem(boardId: string, itemId: string) {
  db.removeBoardItem(boardId, itemId);
  notifyAll({ type: "board-item-remove-response", payload: { boardId, itemId } });
}
export function handleUpdateBoardItem(boardId: string, itemId: string, content?: string) {
  const item = db.updateBoardItem(boardId, itemId, content);
  notifyAll({ type: "board-item-update-response", payload: { boardId, item } });
}

export function handleSocketClose(socket: WebSocket) {
  const id = db.removeUserBySocket(socket);
  notifyAll({ type: "user-remove-response", payload: { id } });
}
