import React, { createContext, ReactNode } from 'react';
import { Topic } from '../types/topic';
import {
  ClipboardStore,
  initialClipboardStore,
  useClipboardStore,
} from './clipboard';
import { EventStore, useEventStore } from './event';
import {
  HomePageStore,
  initialHomePageState,
  useHomePageStore,
} from './homePage';
import { initialPinStore, PinStore, usePinStore } from './pin';
import {
  initialTopicPageState,
  TopicPageStore,
  useTopicPageStore,
} from './topicPage';
import { initialUserStore, UserStore, useUserStore } from './user';

interface State {
  user: UserStore;
  event: EventStore;
  selectedTopic: {
    value: Topic | null;
    setValue: (topic: Topic | null) => void;
  };
  homePage: HomePageStore;
  topicPage: TopicPageStore;
  clipboard: ClipboardStore;
  currentPage: {
    value: 'home' | 'all-topic' | 'topic' | 'about';
    setValue: (value: 'home' | 'all-topic' | 'topic' | 'about') => void;
  };
  pin: PinStore;
  mode: {
    value: 'view' | 'write';
    setValue: (value: 'view' | 'write') => void;
  };
}

const StoreContext = createContext<State>({
  user: initialUserStore,
  event: {
    events: [],
    setEvents: () => {},
  },
  selectedTopic: {
    value: null,
    setValue: () => {},
  },
  homePage: initialHomePageState,
  topicPage: initialTopicPageState,
  clipboard: initialClipboardStore,
  currentPage: {
    value: 'home',
    setValue: () => {},
  },
  pin: initialPinStore,
  mode: {
    value: 'view',
    setValue: () => {},
  },
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [currenPage, setCurrentPage] = React.useState<
    'home' | 'all-topic' | 'topic' | 'about'
  >('home');
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null);
  const [mode, setMode] = React.useState<'view' | 'write'>('view');
  const userState = useUserStore();
  const homePageState = useHomePageStore();
  const topicPageState = useTopicPageStore();
  const clipboardState = useClipboardStore();
  const pinState = usePinStore();
  const eventState = useEventStore();
  return (
    <StoreContext.Provider
      value={{
        user: userState,
        event: eventState,
        selectedTopic: {
          value: selectedTopic,
          setValue: setSelectedTopic,
        },
        currentPage: {
          value: currenPage,
          setValue: setCurrentPage,
        },
        homePage: homePageState,
        topicPage: topicPageState,
        clipboard: clipboardState,
        pin: pinState,
        mode: {
          value: mode,
          setValue: setMode,
        },
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext };
