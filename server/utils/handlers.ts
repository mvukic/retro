import * as boardsDb from "../database/boards-memory.ts";
import * as usersDb from "../database/users.ts";
import { BoardItemType } from "../types.ts";
import { notifyAll, notifySingle } from "./notifiers.ts";

export async function handleAddUser(socket: WebSocket, name: string) {
  const id = usersDb.addUser(socket, name);
  const users = usersDb.getUsers();
  const boards = await boardsDb.getBoards();
  notifyAll({ type: "user-add-response-all-response", payload: { id, name } });
  notifySingle(id, { type: "user-add-response-current-response", payload: { users, boards, id, name } });
}

export function handleSocketClose(socket: WebSocket) {
  const id = usersDb.removeUserBySocket(socket);
  notifyAll({ type: "user-remove-response", payload: { id } });
}

export async function handleAddBoard(name: string) {
  const board = await boardsDb.addBoard(name);
  notifyAll({ type: "board-add-response", payload: { board } });
}

export async function handleUpdateBoard(id: string, name: string) {
  await boardsDb.updateBoard(id, name);
  notifyAll({ type: "board-update-response", payload: { boardId: id, name } });
}

export async function handleRemoveBoard(id: string) {
  await boardsDb.removeBoard(id);
  notifyAll({ type: "board-remove-response", payload: { id } });
}

export async function handleAddBoardItem(boardId: string, content: string, type: BoardItemType) {
  const item = await boardsDb.addBoardItem(boardId, content, type);
  notifyAll({ type: "board-item-add-response", payload: { boardId, item } });
}

export async function handleRemoveBoardItem(boardId: string, itemId: string) {
  await boardsDb.removeBoardItem(boardId, itemId);
  notifyAll({ type: "board-item-remove-response", payload: { boardId, itemId } });
}
export async function handleUpdateBoardItem(boardId: string, itemId: string, content?: string) {
  const item = await boardsDb.updateBoardItem(boardId, itemId, content);
  notifyAll({ type: "board-item-update-response", payload: { boardId, item } });
}
