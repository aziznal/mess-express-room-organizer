"use client";

import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type DarkModeContextType = {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
};

export const DarkModeContext = createContext<DarkModeContextType>({
  toggleDarkMode: () => {},
  isDarkMode: false,
});

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    if (!isLoaded) return;

    const htmlElement = document.documentElement;

    isDarkMode
      ? htmlElement.classList.remove("dark")
      : htmlElement.classList.add("dark");

    setIsDarkMode((state) => !state);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const htmlElement = document.documentElement;

    setIsDarkMode(htmlElement.classList.contains("dark"));
  }, [isLoaded]);

  return (
    <DarkModeContext.Provider value={{ toggleDarkMode, isDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
