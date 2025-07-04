import { useContext, useState } from 'react';
import Cookies from 'js-cookie';
import { useWriter } from './useWriter';
import { StoreContext } from '../store';
import { useEvent } from './useEvent';
import {
  getAuth,
  // onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../utils/firestore';

const useAuth = () => {
  const { getEventByID } = useEvent();
  const { user: userContext } = useContext(StoreContext);
  const [token, setToken] = useState<string | null>(null);
  const { getWriterByID } = useWriter();
  const loginFromToken = async (newToken: string) => {
    setToken(newToken);
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
        console.log('Expiration Date: ', writer, event);
        const currentDate = new Date();
        if (expirationDate < currentDate) {
          console.error('Token has expired');
          window.location.href = '/token-expired';
          throw new Error('Token has expired');
        }
        // Set the cookie with the token and expiration date
        Cookies.set('authToken', newToken, { expires: expirationDate }); // Token will expire in 1 day
      } else {
        // Set the cookie with the token without expiration date
        Cookies.set('authToken', newToken);
      }

      // Set the token in the state
      setToken(newToken);
      setUserStoreFromToken();
    } catch (error) {
      console.error('Error fetching writer document: ', error);
      logoutAsWriter();
      throw new Error('Error fetching writer document');
    }
  };

  const getToken = () => {
    return Cookies.get('authToken');
  };

  const clearToken = () => {
    setToken(null);
    Cookies.remove('authToken');
  };

  const setUserStoreFromToken = async () => {
    const token = getToken();
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
    // logout from firebase auth
    const auth = await getAuth();
    await auth.signOut();
    // clear user state
    userContext.setUserRole();
  };

  const logoutAsWriter = async () => {
    clearToken();
    // clear user state
    userContext.setUserRole();
  };

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       userContext.setAdminRole();
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  return {
    token,
    loginFromToken,
    getToken,
    clearToken,
    setUserStoreFromToken,
    loginAsAdmin,
    logoutAsWriter,
    logoutAsAdmin,
  };
};

// If don't have token return null

export default useAuth;
