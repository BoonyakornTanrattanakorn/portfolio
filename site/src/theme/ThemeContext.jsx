import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const STORAGE_KEY = 'theme';

function safeGetStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(STORAGE_KEY);
    }
  } catch (e) {
    // Storage access blocked or restricted
  }
  return null;
}

function safeSetStorage(value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  } catch (e) {
    // Storage access blocked or restricted
  }
}

function getSystemPrefersDark() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
  mounted: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = safeGetStorage();
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      const prefersDark = getSystemPrefersDark();
      const current = prefersDark ? 'dark' : 'light';
      setTheme(current);
      document.documentElement.setAttribute('data-theme', current);
    }

    // Follow system changes if no manual preference is saved
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (!safeGetStorage()) {
          const next = e.matches ? 'dark' : 'light';
          setTheme(next);
          document.documentElement.setAttribute('data-theme', next);
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    safeSetStorage(next);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next);
    }
  };

  const isDark = theme === 'dark';

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark,
      mounted,
    }),
    [theme, isDark, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
