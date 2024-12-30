import { RequestType } from "./types.ts";
import * as handler from "./handlers.ts";

Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("message", (event: MessageEvent<string>) => {
    const data = JSON.parse(event.data) as RequestType;
    switch (data.type) {
      case "user-add-request":
        handler.handleAddUser(socket, data.payload.name);
        break;
      case "board-add-request":
        handler.handleAddBoard(data.payload.name);
        break;
      case "board-update-request":
        handler.handleUpdateBoard(data.payload.boardId, data.payload.name);
        break;
      case "board-remove-request":
        handler.handleRemoveBoard(data.payload.id);
        break;
      case "board-item-add-request":
        handler.handleAddBoardItem(data.payload.boardId, data.payload.content, data.payload.type);
        break;
      case "board-item-remove-request":
        handler.handleRemoveBoardItem(data.payload.boardId, data.payload.itemId);
        break;
      case "board-item-update-request":
        handler.handleUpdateBoardItem(data.payload.boardId, data.payload.itemId, data.payload.content, data.payload.type);
        break;
    }
  });

  socket.addEventListener("close", () => {
    handler.handleSocketClose(socket);
  });

  return response;
});
