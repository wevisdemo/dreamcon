import { useContext } from "react";
import { StoreContext } from "../store";
import { DreamConEventDB } from "../types/event";

export const usePermission = () => {
  const {
    user: userContext,
    mode: modeContext,
    currentPage,
  } = useContext(StoreContext);

  const isReadOnly = (): boolean => {
    if (modeContext.value === "view") return true;
    if (userContext.userState?.role === "user") return true;
    if (currentPage.value === "about") return true;
    if (currentPage.value === "home") return true;
    return false;
  };
  const userCanEdit = () => {
    const isWriter = userContext.userState?.role === "writer";
    const isAdmin = userContext.userState?.role === "admin";
    return isAdmin || (isWriter && !isReadOnly());
  };
  const isAdmin = () => {
    return userContext.userState?.role === "admin";
  };
  const getWriterEvent = (): DreamConEventDB | null => {
    if (userContext.userState?.role === "writer") {
      return userContext.userState.event;
    }
    return null;
  };

  return { isReadOnly, userCanEdit, isAdmin, getWriterEvent };
};
