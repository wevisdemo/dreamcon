import { useState } from 'react';
import { DreamConEventDB } from '../types/event';
import { Writer } from '../types/writer';

type UserState = WriterRoleState | UserRoleState;

interface WriterRoleState {
  role: 'writer';
  writer: Writer;
  event: DreamConEventDB;
}

interface UserRoleState {
  role: 'user';
}

export interface UserStore {
  userState: UserState | null;
  setWriterRole: (writer: Writer, event: DreamConEventDB) => void;
  setUserRole: () => void;
}

export const initialUserStore: UserStore = {
  userState: {
    role: 'user',
  } as UserState,
  setWriterRole: () => {},
  setUserRole: () => {},
};

export const useUserStore = () => {
  const [userState, setUserState] = useState<UserState | null>(null);

  const setWriterRole = (writer: Writer, event: DreamConEventDB) => {
    setUserState({ role: 'writer', writer, event });
  };

  const setUserRole = () => {
    setUserState({ role: 'user' });
  };

  return {
    userState,
    setWriterRole,
    setUserRole,
  };
};
