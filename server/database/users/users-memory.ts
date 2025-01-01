import { User } from "../../types.ts";
import { UsersRepository } from "./users.repository.ts";

export class UsersRepositoryMemory implements UsersRepository {
  #perUserId = new Map<string, { name: string; socket: WebSocket }>();
  #perSocket = new Map<WebSocket, string>();

  async getUsers(): Promise<User[]> {
    return Array.from(
      this.#perUserId.entries().map(([key, value]) => ({
        id: key,
        name: value.name,
      })),
    );
  }

  async updateUser(id: string, name: string): Promise<void> {
    this.#perUserId.get(id)!.name = name;
  }

  async getSocketForUser(id: string): Promise<WebSocket | undefined> {
    return this.#perUserId.get(id)?.socket;
  }

  async getSockets(): Promise<WebSocket[]> {
    return Array.from(this.#perSocket.keys());
  }

  async removeUserBySocket(socket: WebSocket): Promise<string> {
    const id = this.#perSocket.get(socket)!;
    this.#perUserId.delete(id);
    this.#perSocket.delete(socket);
    return id;
  }

  async addUser(socket: WebSocket, name: string, existingId?: string): Promise<string> {
    const id = existingId ?? crypto.randomUUID();
    this.#perUserId.set(id, { name, socket });
    this.#perSocket.set(socket, id);
    return id;
  }
}
