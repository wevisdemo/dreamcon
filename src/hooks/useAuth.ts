import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useWriter } from "./useWriter";
import { StoreContext } from "../store";
import { useEvent } from "./useEvent";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utils/firestore";

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
        throw new Error("Writer not found for the given ID");
      }
      const event = await getEventByID(writer.event_id);
      if (!event) {
        throw new Error("Event not found for the given ID");
      }

      const { expired_at } = writer;
      const expirationDate = expired_at;
      console.log("Expiration Date: ", writer, event);
      const currentDate = new Date();
      if (expirationDate < currentDate) {
        throw new Error("Token has expired");
      }
      // Set the cookie with the token and expiration date
      await logout();
      Cookies.set("authToken", newToken, { expires: expirationDate }); // Token will expire in 7 days
      // Set the token in the state
      setToken(newToken);
      setUserStoreFromToken();
    } catch (error) {
      console.error("Error fetching writer document: ", error);
      setToken(null);
      Cookies.remove("authToken");
    }
  };

  const getToken = () => {
    return Cookies.get("authToken");
  };

  const clearToken = () => {
    setToken(null);
    Cookies.remove("authToken");
  };

  const setUserStoreFromToken = async () => {
    const token = getToken();
    const adminAuth = await getAuth();
    console.log("Admin Auth: ", adminAuth);
    console.log("adminAuth.currentUser: ", adminAuth.currentUser?.email);
    if (adminAuth.currentUser !== null) {
      userContext.setAdminRole();
    }
    if (token) {
      const writer = await getWriterByID(token);
      if (!writer) {
        throw new Error("Writer not found for the given ID");
      }
      const event = await getEventByID(writer.event_id);
      if (!event) {
        throw new Error("Event not found for the given ID");
      }
      userContext.setWriterRole(writer, event);
    } else {
      userContext.setUserRole();
    }
  };

  const loginAsAdmin = async (username: string, password: string) => {
    await logout();
    await signInWithEmailAndPassword(auth, username, password);
  };

  const logout = async () => {
    clearToken();
    // logout from firebase auth
    const auth = await getAuth();
    await auth.signOut();
    // clear user state
    userContext.setUserRole();
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        userContext.setAdminRole();
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    token,
    loginFromToken,
    getToken,
    clearToken,
    setUserStoreFromToken,
    logout,
    loginAsAdmin,
  };
};

// If don't have token return null

export default useAuth;
