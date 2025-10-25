import { useEffect } from "react"

import { TemplifyForm } from "@/components/TemplifyFormReact/TemplifyForm"

import { useFormStore } from "./store"

import { Password } from "./components/Password"
import { Footer } from "./components/Footer"

export function App() {
  const { enableAutoValidate } = useFormStore()
  useEffect(() => {
    enableAutoValidate()
  }, [])
  return (
    <div className="demo-container largeForm h-full overflow-y-auto">
      <TemplifyForm
        formStore={useFormStore as any}
        customFields={{
          password: <Password />,
        }}
      ></TemplifyForm>
      <Footer></Footer>
    </div>
  )
}

export default App
