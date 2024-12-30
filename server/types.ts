export type User = {
  id: string;
  name: string;
};

export type RequestType =
  | { type: "user-add-request"; payload: { name: string } }
  | { type: "board-add-request"; payload: { name: string } }
  | { type: "board-update-request"; payload: { boardId: string; name: string } }
  | { type: "board-remove-request"; payload: { id: string } }
  | { type: "board-item-add-request"; payload: { boardId: string; content: string; type: BoardItemType } }
  | { type: "board-item-remove-request"; payload: { boardId: string; itemId: string } }
  | { type: "board-item-update-request"; payload: { boardId: string; itemId: string; content?: string; type?: BoardItemType } };

export type ResponseType =
  | { type: "user-add-response-all-response"; payload: { id: string; name: string } }
  | { type: "user-add-response-current-response"; payload: { id: string; name: string; users: User[]; boards: Board[] } }
  | { type: "user-remove-response"; payload: { id: string } }
  | { type: "board-add-response"; payload: { board: Board } }
  | { type: "board-update-response"; payload: { boardId: string; name: string } }
  | { type: "board-remove-response"; payload: { id: string } }
  | { type: "board-item-add-response"; payload: { boardId: string; item: BoardItem } }
  | { type: "board-item-remove-response"; payload: { boardId: string; itemId: string } }
  | { type: "board-item-update-response"; payload: { boardId: string; item: BoardItem } };

export type BoardItemType = "actionPoint" | "improvement" | "keepDoing";

export type BoardItem = {
  id: string;
  content: string;
  type: BoardItemType;
  createdAt: number;
};

export type Board = {
  id: string;
  name: string;
  items: BoardItem[];
  createdAt: number;
};
