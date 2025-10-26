import { useLanguageStoreHooks } from "@/store"
import { storeToRefs } from "pinia"
import { useEffect } from "react"
import { watchEffect } from "vue"
import { useLanguage } from "./useLanguageReact"

const { currentLocale } = storeToRefs(useLanguageStoreHooks())

export function useSyncLanguae2React() {
  const { setLocale } = useLanguage()
  useEffect(() => {
    watchEffect(() => {
      setLocale(currentLocale.value)
    })
  }, [])
}
