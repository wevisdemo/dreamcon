import { Topic } from '../types/topic';

export interface ModalTopicState {
  isModalOpen: boolean;
  defaultState?: Topic;
  mode: 'create' | 'edit';
}

interface ActionCreatePayload {
  mode: 'create';
}

interface ActionEditPayload {
  mode: 'edit';
  defaultState: Topic;
}

export type ModalTopicAction =
  | {
      type: 'OPEN_MODAL';
      payload: ActionCreatePayload | ActionEditPayload;
    }
  | { type: 'CLOSE_MODAL' };

export const initialModalTopicState: ModalTopicState = {
  isModalOpen: false,
  mode: 'create',
};

export const modalTopicReducer = (
  state: ModalTopicState,
  action: ModalTopicAction
): ModalTopicState => {
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

export const initialTopicModalStore = {
  state: initialModalTopicState,
  dispatch: () => null,
};

export interface TopicModalStore {
  state: ModalTopicState;
  dispatch: React.Dispatch<ModalTopicAction>;
}
