/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * ThemeContext provides theme state to entire app without prop drilling
 */
const ThemeContext = createContext(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

/**
 * ThemeProvider wraps app with theme context
 * Usage: useThemeContext() to access isDark and toggleDarkMode
 */
export const ThemeProvider = ({ children }) => {
  const theme = useTheme();
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
