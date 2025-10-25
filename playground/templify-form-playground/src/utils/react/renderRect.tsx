import { StrictMode, type JSX } from "react"
import { createRoot } from "react-dom/client"
import { LanguageProvider } from "@/context/LanguageProvider"
import { ConfigProvider, theme } from "antd"
import type { SeedToken } from "antd/es/theme/internal"

interface IRenderReactProps {
  el: HTMLElement
  App: () => JSX.Element
}

const { defaultAlgorithm } = theme

const customAlgorithm: typeof defaultAlgorithm = (seed: SeedToken) => {
  const base = defaultAlgorithm(seed)
  const cssColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()
  return {
    ...base,
    colorPrimary: cssColor || base.colorPrimary,
  }
}

export const renderRect = ({ el, App }: IRenderReactProps) => {
  if (!el) return
  const root = createRoot(el)
  root.render(
    <StrictMode>
      <ConfigProvider
        theme={{
          algorithm: customAlgorithm,
        }}
      >
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ConfigProvider>
    </StrictMode>
  )
  return () => root.unmount()
}
