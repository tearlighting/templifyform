import { languageManager, useLanguageStoreHooks } from "@/store"
import { storeToRefs } from "pinia"

export function useLanguage() {
  const { currentLocale } = storeToRefs(useLanguageStoreHooks())

  const t = languageManager.t.bind(languageManager)
  function setLocale(locale: Parameters<typeof languageManager.setLocale>[0]) {
    languageManager.setLocale(locale)
    currentLocale.value = languageManager.currentLocale
  }

  return {
    setLocale,
    t,
  }
}
