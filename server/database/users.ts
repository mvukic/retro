import { User } from "../types.ts";

const db = {
  perUserId: new Map<string, { name: string; socket: WebSocket }>(),
  perSocket: new Map<WebSocket, string>(),
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

export function removeUserBySocket(socket: WebSocket) {
  const id = db.perSocket.get(socket)!;
  db.perUserId.delete(id);
  db.perSocket.delete(socket);
  return id;
}

export function addUser(socket: WebSocket, name: string, existingId?: string) {
  const id = existingId ?? crypto.randomUUID();
  db.perUserId.set(id, { name, socket });
  db.perSocket.set(socket, id);
  return id;
}
