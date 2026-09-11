import { createContext, useContext } from 'react';

export interface ErrorAlert {
  title: string;
  message: string;
}

/** Provided by `CommentDndContext`, which renders the error in its alert stack. */
export const ShowErrorContext = createContext<(alert: ErrorAlert) => void>(
  () => {}
);

export const useShowError = () => useContext(ShowErrorContext);
