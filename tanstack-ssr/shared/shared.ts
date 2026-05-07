import { createContext, useContext } from "react";

export interface Theme {
  primaryColour: string;
  label: string;
}

export const defaultTheme: Theme = {
  primaryColour: "#888888",
  label: "default",
};

export const ThemeContext = createContext<Theme>(defaultTheme);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
