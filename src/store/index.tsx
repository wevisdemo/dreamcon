import React, { createContext, ReactNode } from "react";
import {
  HomePageStore,
  initialHomePageState,
  useHomePageStore,
} from "./homePage";
import {
  initialTopicPageState,
  TopicPageStore,
  useTopicPageStore,
} from "./topicPage";
import {
  ClipboardStore,
  initialClipboardStore,
  useClipboardStore,
} from "./clipboard";
import { initialUserStore, UserStore, useUserStore } from "./user";
import { EventStore, useEventStore } from "./event";
import { Topic } from "../types/topic";
import { PinStore, initialPinStore, usePinStore } from "./pin";

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
    value: "home" | "topic";
    setValue: (value: "home" | "topic") => void;
  };
  pin: PinStore;
  mode: {
    value: "view" | "write";
    setValue: (value: "view" | "write") => void;
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
    value: "home",
    setValue: () => {},
  },
  pin: initialPinStore,
  mode: {
    value: "write",
    setValue: () => {},
  },
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [currenPage, setCurrentPage] = React.useState<"home" | "topic">("home");
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null);
  const [mode, setMode] = React.useState<"view" | "write">("write");
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
