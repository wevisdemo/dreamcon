import { useState, useEffect } from 'react';

// filepath: /Users/petchsongpon/projects/wevis/dreamcon/src/store/pin.tsx

export interface PinStore {
  pinnedTopics: string[];
  pinTopic: (topicId: string) => void;
  unpinTopic: (topicId: string) => void;
  getPinnedTopics: () => string[];
}

export const initialPinStore: PinStore = {
  pinnedTopics: [],
  pinTopic: () => {},
  unpinTopic: () => {},
  getPinnedTopics: () => [],
};

const LOCAL_STORAGE_KEY = 'pinned_topics';

export const usePinStore = (): PinStore => {
  const [pinnedTopics, setPinnedTopics] = useState<string[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Save pinned topics to localStorage whenever they change
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      const storedTopics = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTopics) {
        setPinnedTopics(JSON.parse(storedTopics));
      }
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pinnedTopics));
  }, [pinnedTopics, isFirstLoad]);

  const getPinnedTopics = () => {
    const storedTopics = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTopics) {
      const list = JSON.parse(storedTopics);
      return list;
    }
    return [];
  };

  // Pin a topic
  const pinTopic = (topicId: string) => {
    if (!pinnedTopics.includes(topicId)) {
      setPinnedTopics(prev => [...prev, topicId]);
    }
  };

  // Unpin a topic
  const unpinTopic = (topicId: string) => {
    setPinnedTopics(prev => prev.filter(id => id !== topicId));
  };

  return {
    pinnedTopics,
    pinTopic,
    unpinTopic,
    getPinnedTopics,
  };
};
