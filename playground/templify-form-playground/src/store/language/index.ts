import { ref, watchEffect } from "vue"

import type { TLocale } from "language"
import { defineStore } from "pinia"

import { en, jp, zh } from "@/constants/locale"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { createInitialLanguageWithStorge, createLanguageCoreWithPlugins, createLanguageManager, createLanguageManagerGlue, ReactLangugeManager } from "@/utils"

import pinia from "../store"

const { getValue, setValue } = useLocalStorage<
  "languageCache",
  {
    locale: TLocale
  }
>()

const languageManagerCoreIns = createLanguageCoreWithPlugins()
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
  .usePlugin(createInitialLanguageWithStorge(() => getValue("languageCache")?.locale || ("en" as TLocale)))

export const languageManager = createLanguageManagerGlue(languageManagerCoreIns, createLanguageManager)

export const languageManagerReact = createLanguageManagerGlue(languageManagerCoreIns, ReactLangugeManager.createLanguageManager)

export const useLanguageStore = defineStore("language", () => {
  const currentLocale = ref(languageManager.currentLocale)
  const languages = ref(languageManager.languages)
  watchEffect(() => {
    setValue("languageCache", {
      locale: currentLocale.value,
    })
  })
  return {
    currentLocale,
    languages,
  }
})

export const useLanguageStoreHooks = () => useLanguageStore(pinia)
