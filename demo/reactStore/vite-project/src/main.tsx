import "./index.css"
import "@ant-design/v5-patch-for-react-19"

import { StrictMode } from "react"

import { createRoot } from "react-dom/client"

import App from "./App.tsx"
import { LanguageProvider } from "./context/LanguageProvider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
)
