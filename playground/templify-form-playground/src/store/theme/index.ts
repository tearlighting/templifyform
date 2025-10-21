import { ref } from "vue"

import { defineStore } from "pinia"
import type { TTheme } from "theme"

import { darkPalette, forestPalette, lightPalette, neonPalette, pastelPalette } from "@/constants"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { createInitialThemeWithStorge, createThemeManagerWithPlugins } from "@/utils"

import pinia from "../store"

const { getValue, setValue } = useLocalStorage<
  "themeCache",
  {
    theme: TTheme
  }
>()
export const themeManager = createThemeManagerWithPlugins()
  .register({
    value: "light",
    palette: lightPalette,
    labelKey: "theme.light",
  })
  .register({
    value: "dark",
    palette: darkPalette,
    labelKey: "theme.dark",
  })

  .register({
    value: "pastel",
    palette: pastelPalette,
    labelKey: "theme.pastel",
  })

  .register({
    value: "neon",
    palette: neonPalette,
    labelKey: "theme.neon",
  })
  .register({
    value: "forest",
    palette: forestPalette,
    labelKey: "theme.forest",
  })
  .usePlugin(createInitialThemeWithStorge(() => getValue("themeCache")?.theme || "light"))

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref(themeManager.current)
  const themes = ref(themeManager.themes)
  const setTheme = (theme: Parameters<typeof themeManager.setTheme>[0]) => {
    themeManager.setTheme(theme)
    currentTheme.value = theme
    setValue("themeCache", {
      theme: currentTheme.value,
    })
  }

  return {
    currentTheme,
    themes,
    setTheme,
  }
})

export const useThemeStoreHook = () => useThemeStore(pinia)
