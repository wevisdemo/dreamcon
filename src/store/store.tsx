import React, { createContext, ReactNode } from "react";
import {
  HomePageStore,
  initialHomePageState,
  useHomePageStore,
} from "./homePage";

interface State {
  homePage: HomePageStore;
}

const StoreContext = createContext<State>({
  homePage: initialHomePageState,
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const state = useHomePageStore();
  return (
    <StoreContext.Provider value={{ homePage: state }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext };
