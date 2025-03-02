import React, { useReducer } from "react";
import {
  initialModalCommentState,
  ModalCommentAction,
  modalCommentReducer,
  ModalCommentState,
} from "./modalComment";

export interface HomePageStore {
  modalCommentLeft: HomePageModalState;
}

interface HomePageModalState {
  state: ModalCommentState;
  dispatch: React.Dispatch<ModalCommentAction>;
}

export const useHomePageStore = (): HomePageStore => {
  const [modalCommentLeft, dispatchModalCommentLeft] = useReducer(
    modalCommentReducer,
    initialModalCommentState
  );

  return {
    modalCommentLeft: {
      state: modalCommentLeft,
      dispatch: dispatchModalCommentLeft,
    },
  };
};
