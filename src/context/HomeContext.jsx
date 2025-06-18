import { createContext, useContext, useState, useEffect } from "react";

const HomeContext = createContext();

export function HomeProvider({ children }) {
  const [homeId, setHomeId] = useState(localStorage.getItem("selectedHomeId") || "");

  useEffect(() => {
    localStorage.setItem("selectedHomeId", homeId);
  }, [homeId]);

  return (
    <HomeContext.Provider value={{ homeId, setHomeId }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  return useContext(HomeContext);
}
