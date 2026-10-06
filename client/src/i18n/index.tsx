import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "id" | "en";
export const LANGS: Lang[] = ["id", "en"];

/** A string available in every supported language (used in mock data). */
export type Localized = Record<Lang, string>;

/**
 * Messages for one namespace. English is the source of keys; Indonesian must
 * provide every key, so a missing translation fails typecheck.
 */
export type Messages<K extends string> = {
  en: Record<K, string>;
  id: Record<K, string>;
};

export function defineMessages<K extends string>(messages: Messages<K>) {
  return messages;
}

const STORAGE_KEY = "qaflow.lang";
const DEFAULT_LANG: Lang = "id";

function readStoredLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "id" || stored === "en") return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked site data).
  }
  return DEFAULT_LANG;
}

type I18nContextValue = { lang: Lang; setLang: (lang: Lang) => void };
const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore: the choice just won't persist across reloads.
    }
  }, []);
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLang(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLang must be used inside <I18nProvider>");
  return ctx;
}

/** Replaces `{name}` placeholders with values from `vars`. */
export function interpolate(
  template: string,
  vars?: Record<string, string | number>
) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

/**
 * Returns `t(key, vars)` for a namespace and `l(localized)` for mock-data
 * fields that carry both languages.
 */
export function useT<K extends string>(messages: Messages<K>) {
  const { lang } = useLang();
  const t = useCallback(
    (key: K, vars?: Record<string, string | number>) =>
      interpolate(messages[lang][key], vars),
    [lang, messages]
  );
  const l = useCallback((value: Localized) => value[lang], [lang]);
  return { t, l, lang };
}
