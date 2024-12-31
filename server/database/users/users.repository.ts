import { User } from "../../types.ts";

export interface UsersRepository {
  getUsers(): Promise<User[]>;
  getSocketForUser(id: string): Promise<WebSocket | undefined>;
  getSockets(): Promise<WebSocket[]>;
  removeUserBySocket(socket: WebSocket): Promise<string>;
  addUser(socket: WebSocket, name: string, existingId?: string): Promise<string>;
}
