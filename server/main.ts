import { RequestType } from "./types.ts";
import * as handler from "./utils/handlers.ts";

Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("message", async (event: MessageEvent<string>) => {
    const data = JSON.parse(event.data) as RequestType;
    switch (data.type) {
      case "user-add-request":
        await handler.handleAddUser(socket, data.payload.name);
        break;
      case "board-add-request":
        await handler.handleAddBoard(data.payload.name);
        break;
      case "board-update-request":
        await handler.handleUpdateBoard(data.payload.boardId, data.payload.name);
        break;
      case "board-remove-request":
        await handler.handleRemoveBoard(data.payload.id);
        break;
      case "board-item-add-request":
        await handler.handleAddBoardItem(data.payload.boardId, data.payload.content, data.payload.type);
        break;
      case "board-item-remove-request":
        await handler.handleRemoveBoardItem(data.payload.boardId, data.payload.itemId);
        break;
      case "board-item-update-request":
        await handler.handleUpdateBoardItem(data.payload.boardId, data.payload.itemId, data.payload.content);
        break;
      case "board-item-vote-request":
        await handler.handleVoteBoardItem(data.payload.boardId, data.payload.itemId, data.payload.vote);
        break;
    }
  });

  socket.addEventListener("close", () => {
    handler.handleSocketClose(socket);
  });

  return response;
});
