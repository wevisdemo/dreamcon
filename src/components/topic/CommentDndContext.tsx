import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import {
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useHotkeys } from 'react-hotkeys-hook';
import { StoreContext } from '../../store';
import { Comment } from '../../types/comment';
import {
  DraggableCommentProps,
  DroppableData,
  MoveCommentEvent,
} from '../../types/dragAndDrop';
import { useConvertCommentToTopic } from '../../hooks/useConvertCommentToTopic';
import { useMoveComment } from '../../hooks/useMoveComment';
import { usePermission } from '../../hooks/usePermission';
import { ErrorAlert, ShowErrorContext } from '../../hooks/useShowError';
import { SmartPointerSensor } from '../../utils/SmartSenson';
import AlertPopup from '../AlertPopup';
import FullPageLoader from '../FullPageLoader';
import CommentAndChildren from './CommentAndChildren';

const collisionDetectionPointer: CollisionDetection = args => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0
    ? pointerCollisions
    : rectIntersection(args);
};

/** Mount one per page: the clipboard store keeps a single subscriber. */
export default function CommentDndContext({
  children,
}: {
  children: ReactNode;
}) {
  const { subscribeMoveComment, subscribeCopyComment } =
    useContext(StoreContext).clipboard;
  const { getWriterEvent } = usePermission();
  const sensors = useSensors(useSensor(SmartPointerSensor));
  const [draggedCommentProps, setDraggedCommentProps] =
    useState<DraggableCommentProps | null>(null);
  const [previousMoveCommentEvent, setPreviousMoveCommentEvent] =
    useState<MoveCommentEvent | null>(null);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [showPasteAlert, setShowPasteAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState<ErrorAlert | null>(null);
  const {
    moveCommentToComment,
    moveCommentToTopic,
    undoMoveCommentToComment,
    undoMoveCommentToTopic,
    loading: moveCommentLoading,
  } = useMoveComment();
  const {
    convertCommentToTopic,
    undoConvertCommentToTopic,
    loading: convertCommentLoading,
  } = useConvertCommentToTopic();

  const moveComment = async (
    comment: Comment,
    droppableData: DroppableData
  ): Promise<MoveCommentEvent | null> => {
    switch (droppableData.type) {
      case 'topic': {
        if (comment.parent_topic_id === droppableData.topic.id) return null;
        const moved = await moveCommentToTopic(
          comment.id,
          droppableData.topic.id
        );
        return moved ? { comment, droppableData } : null;
      }
      case 'comment': {
        const destination = droppableData.comment;
        const isInvalidDestination =
          destination.id === comment.id ||
          destination.id ===
            comment.parent_comment_ids[comment.parent_comment_ids.length - 1] ||
          destination.parent_comment_ids.includes(comment.id);
        if (isInvalidDestination) return null;
        const moved = await moveCommentToComment(comment, destination.id);
        return moved ? { comment, droppableData } : null;
      }
      case 'convert-to-topic': {
        const eventId = getWriterEvent()?.id;
        if (!eventId) return null;
        const initialTopic = await convertCommentToTopic(comment, eventId);
        return initialTopic && { comment, droppableData, initialTopic };
      }
    }
  };

  const handleMoveComment = async (
    comment: Comment,
    droppableData: DroppableData
  ) => {
    const moveEvent = await moveComment(comment, droppableData);
    if (!moveEvent) return;
    setPreviousMoveCommentEvent(moveEvent);
    setShowCopyAlert(false);
    setShowPasteAlert(true);
  };

  const handleCopyComment = () => {
    setShowPasteAlert(false);
    setShowCopyAlert(true);
    setPreviousMoveCommentEvent(null);
  };

  const handleUndoMoveComment = async () => {
    if (!previousMoveCommentEvent) return;
    const { comment, droppableData, initialTopic } = previousMoveCommentEvent;
    switch (droppableData.type) {
      case 'convert-to-topic':
        if (initialTopic) {
          await undoConvertCommentToTopic(comment, initialTopic);
        }
        break;
      case 'topic':
        await undoMoveCommentToTopic(comment, droppableData.topic);
        break;
      case 'comment':
        await undoMoveCommentToComment(comment);
        break;
    }
    setPreviousMoveCommentEvent(null);
    setShowPasteAlert(false);
  };

  useHotkeys('Meta+z, ctrl+z', () => {
    handleUndoMoveComment();
  });

  // The clipboard store keeps the callback it was given, so route through a
  // ref to let it see the current writer and the last move.
  const clipboardHandlers = useRef({ handleMoveComment, handleCopyComment });
  useEffect(() => {
    clipboardHandlers.current = { handleMoveComment, handleCopyComment };
  });

  useEffect(() => {
    subscribeMoveComment((comment, droppableData) =>
      clipboardHandlers.current.handleMoveComment(comment, droppableData)
    );
    subscribeCopyComment(() => clipboardHandlers.current.handleCopyComment());
  }, [subscribeMoveComment, subscribeCopyComment]);

  return (
    <ShowErrorContext.Provider value={setErrorAlert}>
      <DndContext
        collisionDetection={collisionDetectionPointer}
        onDragStart={({ active }: DragStartEvent) =>
          setDraggedCommentProps(active.data.current as DraggableCommentProps)
        }
        onDragEnd={({ active, over }: DragEndEvent) => {
          if (!over) return;
          handleMoveComment(
            (active.data.current as DraggableCommentProps).comment,
            over.data.current as DroppableData
          );
        }}
        sensors={sensors}
      >
        {(moveCommentLoading || convertCommentLoading) && <FullPageLoader />}
        {children}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          <AlertPopup
            visible={showCopyAlert}
            onClose={() => setShowCopyAlert(false)}
            mode="copy"
          />
          <AlertPopup
            visible={showPasteAlert}
            onClose={() => setShowPasteAlert(false)}
            onUndo={handleUndoMoveComment}
            mode="paste"
          />
          <AlertPopup
            visible={!!errorAlert}
            onClose={() => setErrorAlert(null)}
            mode="error"
            title={errorAlert?.title}
            message={errorAlert?.message}
          />
        </div>
        <DragOverlay>
          {draggedCommentProps && (
            <CommentAndChildren {...draggedCommentProps} />
          )}
        </DragOverlay>
      </DndContext>
    </ShowErrorContext.Provider>
  );
}
