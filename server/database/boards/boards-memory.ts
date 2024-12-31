import { Board, BoardItem, BoardItemType } from "../../types.ts";
import { BoardsRepository } from "./boards.repository.ts";

export class BoardsDatabaseMemory implements BoardsRepository {
  #boards = new Map<string, Board>();

  async getBoards(): Promise<Board[]> {
    return Array.from(this.#boards.values());
  }

  async addBoard(name: string): Promise<Board> {
    const id = crypto.randomUUID();
    const board: Board = {
      id,
      name,
      items: [],
      createdAt: Date.now(),
    };
    this.#boards.set(id, board);
    return board;
  }

  async updateBoard(id: string, name: string): Promise<void> {
    const board = this.#boards.get(id)!;
    board.name = name;
  }

  async removeBoard(id: string): Promise<string> {
    this.#boards.delete(id);
    return id;
  }

  async addBoardItem(boardId: string, content: string, type: BoardItemType): Promise<BoardItem> {
    const id = crypto.randomUUID();
    const item: BoardItem = { id, content, type, createdAt: Date.now(), votes: 0, voterIds: [] };
    const board = this.#boards.get(boardId)!;
    board.items.push(item);
    return item;
  }

  async removeBoardItem(boardId: string, itemId: string): Promise<void> {
    const board = this.#boards.get(boardId);
    if (board === undefined) return;
    board.items = board.items.filter((item) => item.id !== itemId);
  }

  async updateBoardItem(boardId: string, itemId: string, content?: string): Promise<BoardItem> {
    const board = this.#boards.get(boardId)!;
    const index = board.items.findIndex((item) => item.id === itemId);
    const item = board.items[index];
    board.items[index] = { ...item, content: content ?? item.content };
    return board.items[index];
  }

  async voteBoardItem(boardId: string, itemId: string, vote: "up" | "down", userId: string): Promise<BoardItem> {
    const board = this.#boards.get(boardId)!;
    const index = board.items.findIndex((item) => item.id === itemId);
    const item = board.items[index];

    const votes = item.votes + (vote === "up" ? 1 : -1);
    const voterIds = vote === "up" ? [...new Set([...item.voterIds, userId])] : item.voterIds.filter((id) => id !== userId);
    board.items[index] = { ...item, votes, voterIds };
    return board.items[index];
  }
}
