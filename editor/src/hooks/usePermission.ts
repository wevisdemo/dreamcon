import { useContext } from 'react';
import { StoreContext } from '../store';
import { Comment } from '../types/comment';
import { DreamConEventDB } from '../types/event';
import { Topic } from '../types/topic';
import { CommentParent, linkedEventIds } from '../utils/mapping';

export const usePermission = () => {
  const {
    user: userContext,
    mode: modeContext,
    currentPage,
  } = useContext(StoreContext);

  const isReadOnly = (): boolean => {
    if (modeContext.value === 'view') return true;
    if (userContext.userState?.role === 'user') return true;
    if (currentPage.value === 'about') return true;
    if (currentPage.value === 'home') return true;
    return false;
  };
  const userCanEdit = () => {
    const isWriter = userContext.userState?.role === 'writer';
    return isWriter && !isReadOnly();
  };

  const getWriterEvent = (): DreamConEventDB | null => {
    if (userContext.userState?.role === 'writer') {
      return userContext.userState.event;
    }
    return null;
  };

  /**
   * Any event explicitly linked to a topic or comment (its creator or one that
   * joined) edits or deletes it; being linked only through a reply is not enough.
   */
  const canManage = (parent: CommentParent): boolean => {
    const writerEvent = getWriterEvent();
    return !!writerEvent && parent.event_ids.includes(writerEvent.id);
  };

  const canEditCategories = (topic: Topic): boolean => {
    const writerEvent = getWriterEvent();
    return !!writerEvent && linkedEventIds(topic).includes(writerEvent.id);
  };

  /**
   * A topic's sole explicit event deletes instead of leaving. A comment's author
   * (`event_ids[0]`) never leaves: the next event would inherit its authorship.
   */
  const canLeave = (parent: Topic | Comment): boolean => {
    const writerEvent = getWriterEvent();
    if (!writerEvent || !linkedEventIds(parent).includes(writerEvent.id)) {
      return false;
    }
    if ('title' in parent) {
      return !(
        parent.event_ids.length === 1 && parent.event_ids[0] === writerEvent.id
      );
    }
    return parent.event_ids[0] !== writerEvent.id;
  };

  return {
    isReadOnly,
    userCanEdit,
    getWriterEvent,
    canManage,
    canEditCategories,
    canLeave,
  };
};
