import { useState } from "react";
import Cookies from "js-cookie";

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  const saveToken = (newToken: string) => {
    setToken(newToken);
    Cookies.set("authToken", newToken, { expires: 7 }); // Token will expire in 7 days
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
