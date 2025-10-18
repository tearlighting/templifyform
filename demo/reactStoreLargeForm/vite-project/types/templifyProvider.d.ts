import type { createUseTemplifyFormStore } from "@/hooks/useTemplifyFormStore"
import type { ReactNode } from "react"
interface ITemplifyFormProvider {
  storeFactory: ReturnType<typeof createUseTemplifyFormStore>
  customFields?: Record<string, () => ReactNode>
}
