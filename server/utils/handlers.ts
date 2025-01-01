import { BoardItemType } from "../types.ts";
import { notifyAll, notifySingle } from "./notifiers.ts";
import { BoardsRepository } from "../database/boards/boards.repository.ts";
import { UsersRepository } from "../database/users/users.repository.ts";

export class ApiHandler {
  constructor(private boards: BoardsRepository, private users: UsersRepository) {
  }

  async handleAddUser(socket: WebSocket, name: string, existingId?: string) {
    const id = await this.users.addUser(socket, name, existingId);
    const users = await this.users.getUsers();
    const boards = await this.boards.getBoards();
    notifyAll({ type: "user-add-response-all-response", payload: { id, name } }, await this.users.getSockets());
    notifySingle({ type: "user-add-response-current-response", payload: { users, boards, id, name } }, socket);
  }

  async handleUpdateUser(id: string, name: string) {
    await this.users.updateUser(id, name);
    notifyAll({ type: "user-update-response-all-response", payload: { id, name } }, await this.users.getSockets());
  }

  async handleSocketClose(socket: WebSocket) {
    const id = await this.users.removeUserBySocket(socket);
    notifyAll({ type: "user-remove-response", payload: { id } }, await this.users.getSockets());
  }

  async handleAddBoard(name: string) {
    const board = await this.boards.addBoard(name);
    notifyAll({ type: "board-add-response", payload: { board } }, await this.users.getSockets());
  }

  async handleUpdateBoard(id: string, name: string) {
    await this.boards.updateBoard(id, name);
    notifyAll({ type: "board-update-response", payload: { boardId: id, name } }, await this.users.getSockets());
  }

  async handleRemoveBoard(id: string) {
    await this.boards.removeBoard(id);
    notifyAll({ type: "board-remove-response", payload: { id } }, await this.users.getSockets());
  }

  async handleAddBoardItem(boardId: string, content: string, type: BoardItemType) {
    const item = await this.boards.addBoardItem(boardId, content, type);
    notifyAll({ type: "board-item-add-response", payload: { boardId, item } }, await this.users.getSockets());
  }

  async handleRemoveBoardItem(boardId: string, itemId: string) {
    await this.boards.removeBoardItem(boardId, itemId);
    notifyAll({ type: "board-item-remove-response", payload: { boardId, itemId } }, await this.users.getSockets());
  }
  async handleUpdateBoardItem(boardId: string, itemId: string, content?: string) {
    const item = await this.boards.updateBoardItem(boardId, itemId, content);
    notifyAll({ type: "board-item-update-response", payload: { boardId, item } }, await this.users.getSockets());
  }

  async handleVoteBoardItem(boardId: string, itemId: string, vote: "up" | "down", userId: string) {
    const { votes, voterIds } = await this.boards.voteBoardItem(boardId, itemId, vote, userId);
    notifyAll({ type: "board-item-vote-response", payload: { boardId, itemId, votes, voterIds } }, await this.users.getSockets());
  }
}
