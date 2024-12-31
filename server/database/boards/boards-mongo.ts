import { Board, BoardItem, BoardItemType } from "../../types.ts";
import { BoardsRepository } from "./boards.repository.ts";

export class BoardsDatabaseMongo implements BoardsRepository {
  constructor() {
    // const client = new MongoClient("http://localhost:3000");
    //
    // try {
    //   await client.connect();
    //   await client.db("admin").command({ ping: 1 });
    //   console.log("Connected to MongoDB");
    // } catch (error) {
    //   console.error("Error connecting to MongoDB:", error);
    //   Deno.exit(1);
    // }
    // export const db = client.db("retro_db");
    // export const boards = db.collection<Board>("boards");
  }

  async getBoards(): Promise<Board[]> {
    return null!;
  }

  async addBoard(name: string): Promise<Board> {
    return null!;
  }

  async updateBoard(id: string, name: string): Promise<void> {
    return null!;
  }

  async removeBoard(id: string): Promise<string> {
    return null!;
  }

  async addBoardItem(boardId: string, content: string, type: BoardItemType): Promise<BoardItem> {
    return null!;
  }

  async removeBoardItem(boardId: string, itemId: string): Promise<void> {
    return null!;
  }

  async updateBoardItem(boardId: string, itemId: string, content?: string): Promise<BoardItem> {
    return null!;
  }

  async voteBoardItem(boardId: string, itemId: string, vote: "up" | "down", userId: string): Promise<BoardItem> {
    return null!;
  }
}
