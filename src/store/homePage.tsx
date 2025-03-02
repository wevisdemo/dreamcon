import React, { useReducer } from "react";
import {
  initialModalCommentState,
  ModalCommentAction,
  modalCommentReducer,
  ModalCommentState,
} from "./modalComment";

export interface HomePageStore {
  modalCommentMainSection: HomePageModalState;
}

export const initialHomePageState: HomePageStore = {
  modalCommentMainSection: {
    state: initialModalCommentState,
    dispatch: () => null,
  },
};

interface HomePageModalState {
  state: ModalCommentState;
  dispatch: React.Dispatch<ModalCommentAction>;
}

export const useHomePageStore = (): HomePageStore => {
  const [modalCommentMainSection, dispatchModalCommentMainSection] = useReducer(
    modalCommentReducer,
    initialModalCommentState
  );

  return {
    modalCommentMainSection: {
      state: modalCommentMainSection,
      dispatch: dispatchModalCommentMainSection,
    },
  };
};
