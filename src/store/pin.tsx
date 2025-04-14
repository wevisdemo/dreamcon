import { useState, useEffect } from "react";

// filepath: /Users/petchsongpon/projects/wevis/dreamcon/src/store/pin.tsx

export interface PinStore {
  pinnedTopics: string[];
  pinTopic: (topicId: string) => void;
  unpinTopic: (topicId: string) => void;
}

export const initialPinStore: PinStore = {
  pinnedTopics: [],
  pinTopic: () => {},
  unpinTopic: () => {},
};

const LOCAL_STORAGE_KEY = "pinned_topics";

export const usePinStore = (): PinStore => {
  const [pinnedTopics, setPinnedTopics] = useState<string[]>([]);

  // Load pinned topics from localStorage on mount
  useEffect(() => {
    const storedTopics = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTopics) {
      setPinnedTopics(JSON.parse(storedTopics));
    }
  }, []);

  // Save pinned topics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pinnedTopics));
  }, [pinnedTopics]);

  // Pin a topic
  const pinTopic = (topicId: string) => {
    if (!pinnedTopics.includes(topicId)) {
      setPinnedTopics((prev) => [...prev, topicId]);
    }
  };

  // Unpin a topic
  const unpinTopic = (topicId: string) => {
    setPinnedTopics((prev) => prev.filter((id) => id !== topicId));
  };

  return {
    pinnedTopics,
    pinTopic,
    unpinTopic,
  };
};
