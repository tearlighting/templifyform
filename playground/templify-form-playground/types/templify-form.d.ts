import "templify-form"
import type { TI18nKey } from "./language"
declare module "templify-form" {
  interface I18nResolveCxt {
    t: (key: TI18nKey) => string
  }
}
