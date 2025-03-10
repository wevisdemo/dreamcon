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
  const [comment, setComment] = useState<Comment | null>(null);
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
      if (comment && callback) {
        callback(comment, droppableData);
      }
    },
    [callback]
  );

  return {
    setComment,
    emitMoveComment,
    subscribeMoveComment,
  };
};
