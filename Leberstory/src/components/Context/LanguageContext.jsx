import React, { createContext, useContext, useEffect } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const lang = "en";

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within <LanguageProvider>");
  return ctx;
}
