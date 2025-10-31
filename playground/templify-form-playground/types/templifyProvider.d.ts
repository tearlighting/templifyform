import type { JSX } from "react"
import type { createUseTemplifyFormStore } from "templify-form"
interface ITemplifyFormProvider {
  useTemplifyForm: ReturnType<typeof createUseTemplifyFormStore>
  customFields?: Record<string, JSX.Element>
}
