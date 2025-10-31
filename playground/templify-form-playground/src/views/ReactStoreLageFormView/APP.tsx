import { useEffect } from "react"

import { TemplifyForm } from "@/components/TemplifyFormReact/TemplifyForm"

import { useFormStore } from "./store"

import { useSyncLanguae2React } from "@/hooks/useSyncLanguae2React"
import { Footer } from "./components/Footer"
import { Password } from "./components/Password"

export function App() {
  const { enableAutoValidate } = useFormStore()

  useEffect(() => {
    enableAutoValidate()
  }, [])
  useSyncLanguae2React()
  return (
    <div className="demo-container largeForm h-full overflow-y-auto">
      <TemplifyForm
        useTemplifyForm={useFormStore}
        customFields={{
          password: <Password />,
        }}
      ></TemplifyForm>
      <Footer></Footer>
    </div>
  )
}

export default App
