import { useState } from "react";
import Cookies from "js-cookie";
import { useWriter } from "./useWriter";

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const { getWriterByID } = useWriter();
  const saveToken = async (newToken: string) => {
    setToken(newToken);
    try {
      const writer = await getWriterByID(newToken);
      if (!writer) {
        throw new Error("Writer not found for the given ID");
      }
      const { expired_at } = writer;
      const expirationDate = expired_at;
      const currentDate = new Date();
      if (expirationDate < currentDate) {
        throw new Error("Token has expired");
      }
      // Set the cookie with the token and expiration date
      const expiresInDays = Math.floor(
        (expirationDate.getTime() - currentDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      Cookies.set("authToken", newToken, { expires: expiresInDays }); // Token will expire in 7 days
      // Set the token in the state
      setToken(newToken);
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

  return {
    token,
    saveToken,
    getToken,
    clearToken,
  };
};

// If don't have token return null

export default useAuth;
