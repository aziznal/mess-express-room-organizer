"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useDarkMode } from "./DarkModeContext";

export function ToggleDarkMode() {
  const { toggleDarkMode, isDarkMode } = useDarkMode();

  return (
    <div
      onClick={toggleDarkMode}
      className={`fixed
                  top-4
                  right-4
                  cursor-pointer
                  p-4
                  hover:bg-slate-100
                  dark:hover:bg-slate-700
                  rounded-full
                  transition-colors`}
    >
      {isDarkMode ? <MoonIcon /> : <SunIcon />}
    </div>
  );
}
