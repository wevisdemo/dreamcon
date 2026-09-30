import { useState } from 'react';
import { DreamConEvent } from '../types/event';

export interface EventStore {
  events: DreamConEvent[];
  setEvents: (events: DreamConEvent[]) => void;
}

export const useEventStore = () => {
  const [events, setEventsState] = useState<DreamConEvent[]>([]);

  const setEvents = (events: DreamConEvent[]) => {
    setEventsState(events);
  };

  return {
    events,
    setEvents,
  };
};
