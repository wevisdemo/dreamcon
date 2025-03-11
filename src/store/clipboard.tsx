import { useCallback, useState } from "react";
import { Comment } from "../types/comment";
import { DroppableData } from "../types/dragAndDrop";

export interface ClipboardStore {
  setComment: (comment: Comment) => void;
  emitMoveComment: (droppableData: DroppableData) => void;
  subscribeMoveComment: (
    callback: (copiedComment: Comment, droppableData: DroppableData) => void
  ) => void;
}

export const initialClipboardStore: ClipboardStore = {
  setComment: () => {},
  emitMoveComment: () => {},
  subscribeMoveComment: () => {},
};

export const useClipboardStore = (): ClipboardStore => {
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);
  const [callback, setCallback] = useState<
    ((copiedComment: Comment, droppableData: DroppableData) => void) | null
  >(null);

  // Subscribe to event
  const subscribeMoveComment = useCallback(
    (cb: (copiedComment: Comment, droppableData: DroppableData) => void) => {
      setCallback(() => cb);
    },
    []
  );

  // Emit event
  const emitMoveComment = useCallback(
    (droppableData: DroppableData) => {
      if (currentComment && callback) {
        callback(currentComment, droppableData);
      }
    },
    [currentComment, callback]
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
  };
};
