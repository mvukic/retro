import { Board, BoardItem, BoardItemType } from "../../types.ts";

export interface BoardsRepository {
  getBoards(): Promise<Board[]>;
  addBoard(name: string): Promise<Board>;
  updateBoard(id: string, name: string): Promise<void>;
  removeBoard(id: string): Promise<string>;
  addBoardItem(boardId: string, content: string, type: BoardItemType): Promise<BoardItem>;
  removeBoardItem(boardId: string, itemId: string): Promise<void>;
  updateBoardItem(boardId: string, itemId: string, content?: string): Promise<BoardItem>;
  voteBoardItem(boardId: string, itemId: string, vote: "up" | "down", userId: string): Promise<BoardItem>;
}
