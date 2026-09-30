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

export const useAlertIfNotSaved = () => {
  const showError = useShowError();
  return async (save: Promise<boolean>) => {
    if (!(await save)) {
      showError({ title: 'บันทึกไม่สำเร็จ', message: 'กรุณาลองใหม่อีกครั้ง' });
    }
  };
};
