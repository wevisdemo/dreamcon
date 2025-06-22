import { useReducer } from 'react';
import {
  CommentModalStore,
  initialCommentModalStore,
  initialModalCommentState,
  modalCommentReducer,
} from './modalComment';

export interface TopicPageStore {
  modalComment: CommentModalStore;
}

export const initialTopicPageState: TopicPageStore = {
  modalComment: initialCommentModalStore,
};

export const useTopicPageStore = (): TopicPageStore => {
  const [modalComment, dispatchModalComment] = useReducer(
    modalCommentReducer,
    initialModalCommentState
  );

  return {
    modalComment: {
      state: modalComment,
      dispatch: dispatchModalComment,
    },
  };
};
