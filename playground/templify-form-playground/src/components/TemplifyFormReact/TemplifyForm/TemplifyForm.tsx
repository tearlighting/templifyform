import { TemplifyFormProvider, useTemplifyForm } from "./context"

import { Form } from "antd"
import { TemplifyFormItem } from "./TemplifyFormItem"
import { useMemo } from "react"
import type { ITemplifyFormProvider } from "templifyProvider"

export const TemplifyForm = ({ formStore: formStore, customFields }: ITemplifyFormProvider) => {
  const value = useMemo(() => {
    return {
      formStore,
      customFields: customFields ?? {},
    }
  }, [formStore, customFields])

  return (
    <TemplifyFormProvider value={value}>
      <TemplifyFormContent></TemplifyFormContent>
    </TemplifyFormProvider>
  )
}

export const TemplifyFormContent = () => {
  const { formStore: storeFactory } = useTemplifyForm()

  const {
    formStore: { formTemplate },
  } = storeFactory()

  return (
    <Form className="templifyForm">
      {formTemplate?.map((item) => {
        return <TemplifyFormItem key={item.prop} prop={item.prop}></TemplifyFormItem>
      })}
    </Form>
  )
}
