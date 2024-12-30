import { MongoClient } from "mongodb";
import { Board, BoardItem, BoardItemType } from "../types.ts";

const client = new MongoClient("http://localhost:3000");

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  Deno.exit(1);
}
export const db = client.db("retro_db");
export const boards = db.collection<Board>("boards");

export async function getBoards(): Promise<Board[]> {
  return null!;
}

export async function addBoard(name: string): Promise<Board> {
  return null!;
}

export async function updateBoard(id: string, name: string): Promise<void> {
  return null!;
}

export async function removeBoard(id: string): Promise<string> {
  return null!;
}

export async function addBoardItem(boardId: string, content: string, type: BoardItemType): Promise<BoardItem> {
  return null!;
}

export async function removeBoardItem(boardId: string, itemId: string): Promise<void> {
  return null!;
}

export async function updateBoardItem(boardId: string, itemId: string, content?: string): Promise<BoardItem> {
  return null!;
}
