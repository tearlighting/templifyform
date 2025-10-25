import type { createUseTemplifyFormStore } from "templify-form"
import type { ReactNode, JSX } from "react"
interface ITemplifyFormProvider {
  formStore: ReturnType<typeof createUseTemplifyFormStore>
  customFields?: Record<string, JSX.Element>
}
