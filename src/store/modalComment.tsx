import { Comment } from '../types/comment';
import { Topic } from '../types/topic';

export interface ModalCommentState {
  isModalOpen: boolean;
  defaultState?: Comment;
  parentTopicId?: string;
  parentCommentIds?: string[];
  mode: 'create' | 'edit';
  fromTopic?: Topic;
  fromComment?: Comment;
}

export interface ActionCreateCommentPayload {
  mode: 'create';
  parentTopicId: string;
  parentCommentIds: string[];
  fromTopic?: Topic;
  fromComment?: Comment;
}

export interface ActionEditCommentPayload {
  mode: 'edit';
  defaultState: Comment;
}

export type ModalCommentAction =
  | {
      type: 'OPEN_MODAL';
      payload: ActionCreateCommentPayload | ActionEditCommentPayload;
    }
  | { type: 'CLOSE_MODAL' };

export const initialModalCommentState: ModalCommentState = {
  isModalOpen: false,
  mode: 'create',
};

export const modalCommentReducer = (
  state: ModalCommentState,
  action: ModalCommentAction
): ModalCommentState => {
  switch (action.type) {
    case 'OPEN_MODAL': {
      return {
        ...state,
        isModalOpen: true,
        ...action.payload,
      };
    }
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, defaultState: undefined };
    default:
      return state;
  }
};

export const initialCommentModalStore = {
  state: initialModalCommentState,
  dispatch: () => null,
};

export interface CommentModalStore {
  state: ModalCommentState;
  dispatch: React.Dispatch<ModalCommentAction>;
}
