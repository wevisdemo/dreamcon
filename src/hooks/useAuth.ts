import { useContext } from 'react';
import Cookies from 'js-cookie';
import { useWriter } from './useWriter';
import { StoreContext } from '../store';
import { useEvent } from './useEvent';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firestore';

const useAuth = () => {
  const { getEventByID } = useEvent();
  const { user: userContext } = useContext(StoreContext);
  const { getWriterByID } = useWriter();
  const loginFromToken = async (newToken: string) => {
    try {
      const writer = await getWriterByID(newToken);
      if (!writer) {
        console.error('Writer not found for the given ID');
        window.location.href = '/token-expired';
        throw new Error('Writer not found for the given ID');
      }
      const event = await getEventByID(writer.event_id);
      if (!event) {
        throw new Error('Event not found for the given ID');
      }

      const { expired_at, is_permanent } = writer;
      if (!is_permanent && expired_at) {
        const expirationDate = expired_at;
        const currentDate = new Date();
        if (expirationDate < currentDate) {
          console.error('Token has expired');
          window.location.href = '/token-expired';
          throw new Error('Token has expired');
        }
        Cookies.set('authToken', newToken, { expires: expirationDate });
      } else {
        Cookies.set('authToken', newToken);
      }

      setUserStoreFromToken();
    } catch (error) {
      console.error('Error fetching writer document: ', error);
      logoutAsWriter();
      throw new Error('Error fetching writer document');
    }
  };

  const setUserStoreFromToken = async () => {
    const token = Cookies.get('authToken');
    if (token) {
      const writer = await getWriterByID(token);
      if (!writer) {
        throw new Error('Writer not found for the given ID');
      }
      const event = await getEventByID(writer.event_id);
      if (!event) {
        throw new Error('Event not found for the given ID');
      }
      userContext.setWriterRole(writer, event);
    } else {
      userContext.setUserRole();
    }
  };

  const loginAsAdmin = async (username: string, password: string) => {
    await signInWithEmailAndPassword(auth, username, password);
  };

  const logoutAsAdmin = async () => {
    const auth = await getAuth();
    await auth.signOut();
    userContext.setUserRole();
  };

  const logoutAsWriter = async () => {
    Cookies.remove('authToken');
    userContext.setUserRole();
  };

  return {
    loginFromToken,
    setUserStoreFromToken,
    loginAsAdmin,
    logoutAsWriter,
    logoutAsAdmin,
  };
};

export default useAuth;
