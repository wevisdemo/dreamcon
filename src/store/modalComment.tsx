import { Comment } from "../types/comment";

export interface ModalCommentState {
  isModalOpen: boolean;
  defaultState?: Comment;
  topic_id: string;
  mode: "create" | "edit";
}

export type ModalCommentAction =
  | {
      type: "OPEN_MODAL";
      payload: {
        mode: "create" | "edit";
        defaultState?: Comment;
        topic_id: string;
      };
    }
  | { type: "CLOSE_MODAL" };

export const initialModalCommentState: ModalCommentState = {
  isModalOpen: false,
  mode: "create",
  topic_id: "",
};

export const modalCommentReducer = (
  state: ModalCommentState,
  action: ModalCommentAction
): ModalCommentState => {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, isModalOpen: true, ...action.payload };
    case "CLOSE_MODAL":
      return { ...state, isModalOpen: false, defaultState: undefined };
    default:
      return state;
  }
};
