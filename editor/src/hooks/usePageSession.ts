import { useContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { StoreContext } from '../store';
import { db } from '../utils/firestore';
import useAuth from './useAuth';
import { useEvent } from './useEvent';

export const usePageSession = (page: 'topic' | 'all-topic') => {
  const {
    currentPage,
    user: userContext,
    mode: modeContext,
    event: eventContext,
  } = useContext(StoreContext);
  const { loginFromToken, setUserStoreFromToken } = useAuth();
  const { getEvents } = useEvent();
  const [eventsReady, setEventsReady] = useState(false);

  /** Runs the invite login first so a stale cookie cannot overwrite its result. */
  const startWriterSession = async () => {
    const params = new URLSearchParams(window.location.search);
    const writerToken = params.get('writer');
    if (writerToken) {
      try {
        await loginFromToken(writerToken);
        params.delete('writer');
        window.location.href = `${window.location.pathname}?${params.toString()}`;
        return;
      } catch {
        // loginFromToken logs the failure and redirects expired or unknown tokens.
      }
    }
    setUserStoreFromToken();
  };

  useEffect(() => {
    currentPage.setValue(page);
    startWriterSession();
    return onSnapshot(collection(db, 'events'), async () => {
      eventContext.setEvents(await getEvents());
      setEventsReady(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount; the cleanup unsubscribes
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'view') {
      modeContext.setValue('view');
    } else if (userContext.userState?.role === 'writer') {
      modeContext.setValue('write');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-evaluate mode only when the signed-in user changes
  }, [userContext.userState]);

  return { eventsReady };
};
