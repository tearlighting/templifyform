import { useLanguageContext } from "@/context/LanguageProvider"
import { useCallback } from "react"

export function useLanguage() {
  const { manager, setCurrentLanguage } = useLanguageContext()

  const t = useCallback((...args: Parameters<typeof manager.t>) => {
    const res = manager.t(...args)
    return res
  }, [])
  const setLocale = useCallback((locale: Parameters<typeof manager.setLocale>[0]) => {
    manager.setLocale(locale)
    setCurrentLanguage(locale)
  }, [])
  return {
    t,
    setLocale,
  }
}
