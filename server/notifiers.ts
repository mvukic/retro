import { ResponseType } from "./types.ts";
import { getSocketForUser, getSockets } from "./database.ts";

export function notifyAll(response: ResponseType) {
  for (const s of getSockets()) {
    s.send(JSON.stringify(response));
  }
}

export function notifySingle(id: string, response: ResponseType) {
  const socket = getSocketForUser(id);
  if (socket == undefined) return;
  socket.send(JSON.stringify(response));
}
