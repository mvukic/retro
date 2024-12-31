import { ResponseType } from "../types.ts";

export function notifyAll(response: ResponseType, sockets: WebSocket[]) {
  for (const s of sockets) {
    s.send(JSON.stringify(response));
  }
}

export function notifySingle(response: ResponseType, socket: WebSocket) {
  socket.send(JSON.stringify(response));
}
