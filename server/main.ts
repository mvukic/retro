import { RequestType } from "./types.ts";
import { BoardsDatabaseMemory } from "./database/boards/index.ts";
import { ApiHandler } from "./utils/handlers.ts";
import { UsersRepositoryMemory } from "./database/users/index.ts";

const boards = new BoardsDatabaseMemory();
const users = new UsersRepositoryMemory();
const handler = new ApiHandler(boards, users);

Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("message", async (event: MessageEvent<string>) => {
    const data = JSON.parse(event.data) as RequestType;
    switch (data.type) {
      case "user-add-request":
        await handler.handleAddUser(socket, data.payload.name, data.payload.id);
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
        await handler.handleVoteBoardItem(data.payload.boardId, data.payload.itemId, data.payload.vote, data.payload.userId);
        break;
    }
  });

  socket.addEventListener("close", async () => {
    await handler.handleSocketClose(socket);
  });

  return response;
});
