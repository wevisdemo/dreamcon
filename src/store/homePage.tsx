import React, { useReducer, useState } from 'react';
import {
  CommentModalStore,
  initialCommentModalStore,
  initialModalCommentState,
  modalCommentReducer,
} from './modalComment';
import { LightWeightTopic } from '../types/topic';
import {
  initialModalTopicState,
  initialTopicModalStore,
  TopicModalStore,
  modalTopicReducer,
} from './modalTopic';

export interface HomePageStore {
  modalCommentMainSection: CommentModalStore;
  modalTopicMainSection: TopicModalStore;
  modalCommentSideSection: CommentModalStore;
  lightWeightTopics: {
    state: LightWeightTopic[];
    setState: React.Dispatch<React.SetStateAction<LightWeightTopic[]>>;
  };
}

export const initialHomePageState: HomePageStore = {
  modalCommentMainSection: initialCommentModalStore,
  modalTopicMainSection: initialTopicModalStore,
  modalCommentSideSection: initialCommentModalStore,
  lightWeightTopics: {
    state: [],
    setState: () => [],
  },
};

export const useHomePageStore = (): HomePageStore => {
  const [modalCommentMainSection, dispatchModalCommentMainSection] = useReducer(
    modalCommentReducer,
    initialModalCommentState
  );

  const [modalTopicMainSection, dispatchModalTopicMainSection] = useReducer(
    modalTopicReducer,
    initialModalTopicState
  );
  const [modalCommentSideSection, dispatchModalCommentSideSection] = useReducer(
    modalCommentReducer,
    initialModalCommentState
  );
  const [lightWeightTopics, setLightWeightTopics] = useState<
    LightWeightTopic[]
  >([]);

  return {
    modalCommentMainSection: {
      state: modalCommentMainSection,
      dispatch: dispatchModalCommentMainSection,
    },
    modalTopicMainSection: {
      state: modalTopicMainSection,
      dispatch: dispatchModalTopicMainSection,
    },
    modalCommentSideSection: {
      state: modalCommentSideSection,
      dispatch: dispatchModalCommentSideSection,
    },
    lightWeightTopics: {
      state: lightWeightTopics,
      setState: setLightWeightTopics,
    },
  };
};
