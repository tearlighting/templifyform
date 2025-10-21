import { languageManager, useLanguageStoreHooks } from "@/store"
import { storeToRefs } from "pinia"
import type { StrictMeta } from "router"

export function useLanguage() {
  const { currentLocale } = storeToRefs(useLanguageStoreHooks())

  const t = languageManager.t.bind(languageManager)
  function setLocale(locale: Parameters<typeof languageManager.setLocale>[0]) {
    languageManager.setLocale(locale)
    currentLocale.value = languageManager.currentLocale
  }
  function getMenuTitle<T extends { meta: StrictMeta }>({ meta }: T) {
    if (meta.hidden) {
      return ""
    }
    const { title, titleKey } = meta
    return titleKey ? t(titleKey) : title
  }
  return {
    setLocale,
    t,
    getMenuTitle,
  }
}
