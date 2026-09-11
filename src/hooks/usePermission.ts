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
   * A topic or comment can be edited or deleted only by its sole linked event:
   * once another event joins or replies, it is shared and nobody can change it.
   * The event must also be linked explicitly, not only through a reply.
   */
  const canManage = (parent: CommentParent): boolean => {
    const writerEvent = getWriterEvent();
    const eventIds = linkedEventIds(parent);
    return (
      !!writerEvent &&
      eventIds.length === 1 &&
      eventIds[0] === writerEvent.id &&
      parent.event_ids.includes(writerEvent.id)
    );
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
    canLeave,
  };
};
