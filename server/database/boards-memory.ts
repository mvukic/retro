import { Board, BoardItem, BoardItemType } from "../types.ts";

const db = {
  boards: new Map<string, Board>(),
} as const;

export async function getBoards(): Promise<Board[]> {
  return Array.from(db.boards.values());
}

export async function addBoard(name: string): Promise<Board> {
  const id = crypto.randomUUID();
  const board: Board = {
    id,
    name,
    items: [],
    createdAt: Date.now(),
  };
  db.boards.set(id, board);
  return board;
}

export async function updateBoard(id: string, name: string): Promise<void> {
  const board = db.boards.get(id)!;
  board.name = name;
}

export async function removeBoard(id: string): Promise<string> {
  db.boards.delete(id);
  return id;
}

export async function addBoardItem(boardId: string, content: string, type: BoardItemType): Promise<BoardItem> {
  const id = crypto.randomUUID();
  const item: BoardItem = { id, content, type, createdAt: Date.now(), votes: 0, voterIds: [] };
  const board = db.boards.get(boardId)!;
  board.items.push(item);
  return item;
}

export async function removeBoardItem(boardId: string, itemId: string): Promise<void> {
  const board = db.boards.get(boardId);
  if (board === undefined) return;
  board.items = board.items.filter((item) => item.id !== itemId);
}

export async function updateBoardItem(boardId: string, itemId: string, content?: string): Promise<BoardItem> {
  const board = db.boards.get(boardId)!;
  const index = board.items.findIndex((item) => item.id === itemId);
  const item = board.items[index];
  board.items[index] = { ...item, content: content ?? item.content };
  return board.items[index];
}

export async function voteBoardItem(boardId: string, itemId: string, vote: "up" | "down", userId: string): Promise<BoardItem> {
  const board = db.boards.get(boardId)!;
  const index = board.items.findIndex((item) => item.id === itemId);
  const item = board.items[index];

  const votes = item.votes + (vote === "up" ? 1 : -1);
  const voterIds = vote === "up" ? [...new Set([...item.voterIds, userId])] : item.voterIds.filter((id) => id !== userId);
  board.items[index] = { ...item, votes, voterIds };
  return board.items[index];
}
