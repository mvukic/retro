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
  return boards.find().toArray();
}

export async function addBoard(name: string): Promise<Board> {
  const board: Board = {
    id: crypto.randomUUID(),
    name,
    items: [],
    createdAt: Date.now(),
  };
  await boards.insertOne(board);
  return board;
}

export async function updateBoard(id: string, name: string): Promise<void> {
  await boards.updateOne({ id: id }, { $set: { name: name } });
}

export async function removeBoard(id: string): Promise<string> {
  await boards.deleteOne({ id: id });
  return id;
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
