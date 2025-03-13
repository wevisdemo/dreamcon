import { useCallback, useState } from "react";
import { Comment } from "../types/comment";
import { DroppableData } from "../types/dragAndDrop";

export interface ClipboardStore {
  setComment: (comment: Comment) => void;
  emitMoveComment: (droppableData: DroppableData) => void;
  subscribeMoveComment: (
    callback: (copiedComment: Comment, droppableData: DroppableData) => void
  ) => void;
  emitCopyComment: (comment: Comment) => void;
  subscribeCopyComment: (callback: (comment: Comment) => void) => void;
}

export const initialClipboardStore: ClipboardStore = {
  setComment: () => {},
  emitMoveComment: () => {},
  emitCopyComment: () => {},
  subscribeMoveComment: () => {},
  subscribeCopyComment: () => {},
};

export const useClipboardStore = (): ClipboardStore => {
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);

  const [copyCallback, setCopyCallback] = useState<
    ((comment: Comment) => void) | null
  >(null);
  const [pasteCallback, setPasteCallback] = useState<
    ((copiedComment: Comment, droppableData: DroppableData) => void) | null
  >(null);

  // Subscribe to event
  const subscribeMoveComment = useCallback(
    (cb: (copiedComment: Comment, droppableData: DroppableData) => void) => {
      setPasteCallback(() => cb);
    },
    []
  );

  const emitCopyComment = useCallback(
    (comment: Comment) => {
      if (copyCallback) {
        setCurrentComment(comment);
        copyCallback(comment);
      }
    },
    [currentComment, copyCallback]
  );

  const subscribeCopyComment = useCallback((cb: (comment: Comment) => void) => {
    setCopyCallback(() => cb);
  }, []);

  // Emit event
  const emitMoveComment = useCallback(
    async (droppableData: DroppableData) => {
      if (currentComment && pasteCallback) {
        await pasteCallback(currentComment, droppableData);
      }
      setCurrentComment(null);
    },
    [currentComment, pasteCallback]
  );

  const setComment = useCallback(
    (comment: Comment) => {
      setCurrentComment(comment);
    },
    [setCurrentComment]
  );

  return {
    setComment,
    emitMoveComment,
    subscribeMoveComment,
    emitCopyComment,
    subscribeCopyComment,
  };
};
