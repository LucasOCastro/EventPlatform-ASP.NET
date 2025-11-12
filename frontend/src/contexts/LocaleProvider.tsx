import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { z } from "zod";
import type { $ZodConfig } from "zod/v4/core";

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
}

async function getZodLocale(
  locale: string,
): Promise<() => Partial<$ZodConfig>> {
  const { default: defaultLocale } = await import(`zod/v4/locales/en.js`);
  return defaultLocale;
  /*try {
    const { default: zodLocale } = await import(`zod/v4/locales/${locale}.js`);
    return zodLocale;
  } catch (error) {
    console.error(`Failed to load Zod locale for ${locale}:`, error);

    const { default: defaultLocale } = await import(`zod/v4/locales/en.js`);
    return defaultLocale;
  }*/
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(() => {
    return localStorage.getItem("locale") || "en";
  });

  useEffect(() => {
    getZodLocale(locale).then((zodLocale) => z.config(zodLocale()));
  }, [locale]);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
