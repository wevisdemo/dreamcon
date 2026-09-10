import { useContext } from 'react';
import { StoreContext } from '../store';
import { DreamConEventDB } from '../types/event';
import { Topic } from '../types/topic';
import { linkedEventIds } from '../utils/mapping';

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

  const isWriterOwner = (eventIds: string[]): boolean => {
    if (userContext.userState?.role === 'writer') {
      return eventIds.includes(userContext.userState.event.id);
    }
    return false;
  };

  /**
   * A topic can be edited or deleted only by its sole linked event: once another
   * event joins or comments, the topic is shared and nobody can change it.
   */
  const canManageTopic = (topic: Topic): boolean => {
    const writerEvent = getWriterEvent();
    const eventIds = linkedEventIds(topic);
    return (
      !!writerEvent && eventIds.length === 1 && eventIds[0] === writerEvent.id
    );
  };

  return {
    isReadOnly,
    userCanEdit,
    getWriterEvent,
    isWriterOwner,
    canManageTopic,
  };
};
