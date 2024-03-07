"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jsCookie from "js-cookie";

type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType>({} as any);

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({
  initialValue,
  cookieKey,
  children,
}: {
  initialValue: boolean;
  cookieKey: string;
  children: React.ReactNode;
}) => {
  const [isDarkMode, setIsDarkMode] = useState(initialValue);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newState = !prev;

      console.log("toggling dark mode to", newState);

      jsCookie.set(cookieKey, String(newState));

      return newState;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
