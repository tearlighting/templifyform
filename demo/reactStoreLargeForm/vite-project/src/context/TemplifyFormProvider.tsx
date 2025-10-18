import { createContext, useContext } from "react"

import { ITemplifyFormProvider } from "templifyProvider"

const context = createContext<null | ITemplifyFormProvider>(null)

export const TemplifyFormProvider = ({ children, value }: { children: React.ReactNode; value: ITemplifyFormProvider }) => {
  return <context.Provider value={value}>{children}</context.Provider>
}

export const useTemplifyForm = () => {
  const store = useContext(context)
  if (!store) throw new Error("useTemplifyForm must be used within a TemplifyFormProvider")
  return store
}
