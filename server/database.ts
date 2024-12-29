import { Board, BoardItem, BoardItemType, User } from "./types.ts";

const db = {
  perUserId: new Map<string, { name: string; socket: WebSocket }>(),
  perSocket: new Map<WebSocket, string>(),
  boards: new Map<string, Board>(),
} as const;

export function getUsers(): User[] {
  return Array.from(
    db.perUserId.entries().map(([key, value]) => ({
      id: key,
      name: value.name,
    })),
  );
}

export function getSocketForUser(id: string): WebSocket | undefined {
  return db.perUserId.get(id)?.socket;
}

export function getSockets(): WebSocket[] {
  return Array.from(db.perSocket.keys());
}

export function removeUser(id: string) {
  const socket = getSocketForUser(id);
  if (socket) {
    socket.close();
    db.perUserId.delete(id);
    db.perSocket.delete(socket);
  }
}

export function removeUserBySocket(socket: WebSocket) {
  const id = db.perSocket.get(socket);
  if (id) {
    db.perUserId.delete(id);
    db.perSocket.delete(socket);
  }
}

export function addUser(socket: WebSocket, name: string) {
  const id = crypto.randomUUID();
  db.perUserId.set(id, { name, socket });
  db.perSocket.set(socket, id);
  return id;
}

export function addBoard(name: string): Board {
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

export function updateBoard(id: string, name: string) {
  const board = db.boards.get(id)!;
  board.name = name;
}

export function removeBoard(id: string): string {
  db.boards.delete(id);
  return id;
}

export function addBoardItem(boardId: string, content: string, type: BoardItemType): BoardItem {
  const id = crypto.randomUUID();
  const item: BoardItem = { id, content, type, createdAt: Date.now() };
  const board = db.boards.get(boardId)!;
  board.items.push(item);
  return item;
}

export function removeBoardItem(boardId: string, itemId: string) {
  const board = db.boards.get(boardId);
  if (board === undefined) return;
  board.items = board.items.filter((item) => item.id !== itemId);
}

export function updateBoardItem(boardId: string, itemId: string, content?: string, type?: BoardItemType) {
  const board = db.boards.get(boardId)!;
  const index = board.items.findIndex((item) => item.id === itemId);
  const item = board.items[index];
  board.items[index] = { ...item, type: type ?? item.type, content: content ?? item.content };
  return board.items[index];
}
