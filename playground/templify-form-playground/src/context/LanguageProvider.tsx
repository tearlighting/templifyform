import { languageManagerReact as languageManager } from "@/store/language"
import { createContext, type ReactNode, useContext, useState } from "react"

const LanguageContext = createContext({
  manager: languageManager,
  currentLanguage: languageManager.currentLocale,
  setCurrentLanguage: languageManager.setLocale,
})

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState(languageManager.currentLocale)
  return (
    <LanguageContext.Provider
      value={{
        manager: languageManager,
        currentLanguage,
        setCurrentLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguageContext = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("LanguageManager not provided")
  return ctx
}
