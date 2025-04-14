import { useState } from "react";
import { DreamConEvent } from "../types/event";

// filepath: /Users/petchsongpon/projects/wevis/dreamcon/src/store/event.tsx

export interface EventStore {
  events: DreamConEvent[];
  setEvents: (events: DreamConEvent[]) => void;
}

export const initialEventStore: EventStore = {
  events: [],
  setEvents: () => {},
};

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
