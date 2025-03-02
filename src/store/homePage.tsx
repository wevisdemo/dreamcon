import React, { useReducer, useState } from "react";
import {
  initialModalCommentState,
  ModalCommentAction,
  modalCommentReducer,
  ModalCommentState,
} from "./modalComment";
import { Topic } from "../types/topic";

export interface HomePageStore {
  selectedTopic: {
    state: Topic | null;
    setState: React.Dispatch<React.SetStateAction<Topic | null>>;
  };
  modalCommentMainSection: HomePageModalState;
  modalCommentSideSection: HomePageModalState;
}

export const initialHomePageState: HomePageStore = {
  selectedTopic: {
    state: null,
    setState: () => null,
  },
  modalCommentMainSection: {
    state: initialModalCommentState,
    dispatch: () => null,
  },
  modalCommentSideSection: {
    state: initialModalCommentState,
    dispatch: () => null,
  },
};

interface HomePageModalState {
  state: ModalCommentState;
  dispatch: React.Dispatch<ModalCommentAction>;
}

export const useHomePageStore = (): HomePageStore => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const [modalCommentMainSection, dispatchModalCommentMainSection] = useReducer(
    modalCommentReducer,
    initialModalCommentState
  );
  const [modalCommentSideSection, dispatchModalCommentSideSection] = useReducer(
    modalCommentReducer,
    initialModalCommentState
  );

  return {
    selectedTopic: {
      state: selectedTopic,
      setState: setSelectedTopic,
    },
    modalCommentMainSection: {
      state: modalCommentMainSection,
      dispatch: dispatchModalCommentMainSection,
    },
    modalCommentSideSection: {
      state: modalCommentSideSection,
      dispatch: dispatchModalCommentSideSection,
    },
  };
};
