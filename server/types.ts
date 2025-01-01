export type User = {
  id: string;
  name: string;
};

export type UserAddRequest = { type: "user-add-request"; payload: { name: string; id?: string } };
export type UserUpdateRequest = { type: "user-update-request"; payload: { id: string; name: string } };
export type BoardAddRequest = { type: "board-add-request"; payload: { name: string } };
export type BoardUpdateRequest = { type: "board-update-request"; payload: { boardId: string; name: string } };
export type BoardRemoveRequest = { type: "board-remove-request"; payload: { id: string } };
export type BoardItemAddRequest = { type: "board-item-add-request"; payload: { boardId: string; content: string; type: BoardItemType } };
export type BoardItemRemoveRequest = { type: "board-item-remove-request"; payload: { boardId: string; itemId: string } };
export type BoardItemUpdateRequest = { type: "board-item-update-request"; payload: { boardId: string; itemId: string; content?: string } };
export type BoardItemVoteRequest = {
  type: "board-item-vote-request";
  payload: { boardId: string; itemId: string; vote: "up" | "down"; userId: string };
};

export type RequestType =
  | UserAddRequest
  | BoardAddRequest
  | BoardUpdateRequest
  | BoardRemoveRequest
  | BoardItemAddRequest
  | BoardItemRemoveRequest
  | BoardItemUpdateRequest
  | BoardItemVoteRequest
  | UserUpdateRequest;

export type UserAddResponseAllResponse = { type: "user-add-response-all-response"; payload: { id: string; name: string } };
export type UserUpdateResponseAllResponse = { type: "user-update-response-all-response"; payload: { id: string; name: string } };
export type UserAddResponseCurrentResponse = {
  type: "user-add-response-current-response";
  payload: { id: string; name: string; users: User[]; boards: Board[] };
};
export type UserRemoveResponse = { type: "user-remove-response"; payload: { id: string } };
export type BoardAddResponse = { type: "board-add-response"; payload: { board: Board } };
export type BoardUpdateResponse = { type: "board-update-response"; payload: { boardId: string; name: string } };
export type BoardRemoveResponse = { type: "board-remove-response"; payload: { id: string } };
export type BoardItemAddResponse = { type: "board-item-add-response"; payload: { boardId: string; item: BoardItem } };
export type BoardItemUpdateResponse = { type: "board-item-remove-response"; payload: { boardId: string; itemId: string } };
export type BoardItemRemoveResponse = { type: "board-item-update-response"; payload: { boardId: string; item: BoardItem } };
export type BoardItemVoteResponse = {
  type: "board-item-vote-response";
  payload: { boardId: string; itemId: string; votes: number; voterIds: string[] };
};

export type ResponseType =
  | UserAddResponseAllResponse
  | UserAddResponseCurrentResponse
  | UserRemoveResponse
  | BoardAddResponse
  | BoardUpdateResponse
  | BoardRemoveResponse
  | BoardItemAddResponse
  | BoardItemUpdateResponse
  | BoardItemRemoveResponse
  | BoardItemVoteResponse
  | UserUpdateResponseAllResponse;

export type BoardItemType = "actionPoint" | "improvement" | "keepDoing";

export type BoardItem = {
  id: string;
  content: string;
  type: BoardItemType;
  createdAt: number;
  votes: number;
  voterIds: string[];
};

export type Board = {
  id: string;
  name: string;
  items: BoardItem[];
  createdAt: number;
};
