import { createContext, useContext, useEffect, useState } from "react";
import api, { clearTokens } from "../lib/api";

let userContext = createContext();

let userProvider = ({ children }) => {
  let [user, setUser] = useState(null);
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function handleAuthExpired() {
      setUser(null);
    }

    window.addEventListener("auth:expired", handleAuthExpired);

    async function restoreUser() {
      try {
        const response = await api.get("/user/me");
        const payload = response.data;
        const currentUser =
          payload?.data?.data || payload?.data?.user || payload?.data;

        setUser(currentUser || null);
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreUser();

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </userContext.Provider>
  );
};

const useUser = () => {
  return useContext(userContext);
};

export { userProvider, useUser };
