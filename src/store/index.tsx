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

interface State {
  homePage: HomePageStore;
  topicPage: TopicPageStore;
  currentPage: {
    value: "home" | "topic";
    setValue: (value: "home" | "topic") => void;
  };
}

const StoreContext = createContext<State>({
  homePage: initialHomePageState,
  topicPage: initialTopicPageState,
  currentPage: {
    value: "home",
    setValue: () => {},
  },
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [currenPage, setCurrentPage] = React.useState<"home" | "topic">("home");
  const homePageState = useHomePageStore();
  const topicPageState = useTopicPageStore();
  return (
    <StoreContext.Provider
      value={{
        currentPage: {
          value: currenPage,
          setValue: setCurrentPage,
        },
        homePage: homePageState,
        topicPage: topicPageState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext };
