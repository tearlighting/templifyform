import { createLanguageCore, createLanguageManager, createLanguageManagerGlue } from "@/utils"
import { zh, en, jp } from "@/locale"
import { defineStore } from "pinia"
import { ref } from "vue"
import pinia from "../store"

const languageManagerCoreIns = createLanguageCore()
  .register({
    label: "中文",
    value: "zh",
    message: zh,
  })
  .register({
    label: "English",
    value: "en",
    message: en,
  })
  .register({
    label: "日本語",
    value: "jp",
    message: jp,
  })

export const languageManager = createLanguageManagerGlue(languageManagerCoreIns, createLanguageManager)

export const useLanguageStore = defineStore("language", () => {
  const currentLocale = ref(languageManager.currentLocale)
  const languages = ref(languageManager.languages)
  return {
    currentLocale,
    languages,
  }
})

export const useLanguageStoreHooks = () => useLanguageStore(pinia)
