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

interface State {
  user: UserStore;
  event: EventStore;
  homePage: HomePageStore;
  topicPage: TopicPageStore;
  clipboard: ClipboardStore;
  currentPage: {
    value: "home" | "topic";
    setValue: (value: "home" | "topic") => void;
  };
}

const StoreContext = createContext<State>({
  user: initialUserStore,
  event: {
    events: [],
    setEvents: () => {},
  },
  homePage: initialHomePageState,
  topicPage: initialTopicPageState,
  clipboard: initialClipboardStore,
  currentPage: {
    value: "home",
    setValue: () => {},
  },
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [currenPage, setCurrentPage] = React.useState<"home" | "topic">("home");
  const userState = useUserStore();
  const homePageState = useHomePageStore();
  const topicPageState = useTopicPageStore();
  const clipboardState = useClipboardStore();
  const eventState = useEventStore();
  return (
    <StoreContext.Provider
      value={{
        user: userState,
        event: eventState,
        currentPage: {
          value: currenPage,
          setValue: setCurrentPage,
        },
        homePage: homePageState,
        topicPage: topicPageState,
        clipboard: clipboardState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext };
