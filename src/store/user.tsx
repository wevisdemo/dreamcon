import { useState } from "react";
import { DreamConEventDB } from "../types/event";
import { Writer } from "../types/writer";

export type UserState = WriterRoleState | UserRoleState | AdminRoleState;

export interface WriterRoleState {
  role: "writer";
  writer: Writer;
  event: DreamConEventDB;
}

export interface UserRoleState {
  role: "user";
}

export interface AdminRoleState {
  role: "admin";
}

export interface UserStore {
  userState: UserState | null;
  setWriterRole: (writer: Writer, event: DreamConEventDB) => void;
  setUserRole: () => void;
  setAdminRole: () => void;
}

export const initialUserStore: UserStore = {
  userState: {
    role: "user",
  } as UserState,
  setWriterRole: () => {},
  setUserRole: () => {},
  setAdminRole: () => {},
};

export const useUserStore = () => {
  const [userState, setUserState] = useState<UserState | null>(null);

  const setWriterRole = (writer: Writer, event: DreamConEventDB) => {
    setUserState({ role: "writer", writer, event });
  };

  const setUserRole = () => {
    setUserState({ role: "user" });
  };

  const setAdminRole = () => {
    setUserState({ role: "admin" });
  };

  return {
    userState,
    setWriterRole,
    setUserRole,
    setAdminRole,
  };
};
