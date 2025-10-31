import { TemplifyFormProvider, useTemplifyFormContext } from "./context"

import { Form } from "antd"
import { useMemo } from "react"
import type { ITemplifyFormProvider } from "templifyProvider"
import { TemplifyFormItem } from "./TemplifyFormItem"

export const TemplifyForm = ({ useTemplifyForm, customFields }: ITemplifyFormProvider) => {
  const value = useMemo(() => {
    return {
      useTemplifyForm,
      customFields: customFields ?? {},
    }
  }, [useTemplifyForm, customFields])

  return (
    <TemplifyFormProvider value={value}>
      <TemplifyFormContent></TemplifyFormContent>
    </TemplifyFormProvider>
  )
}

export const TemplifyFormContent = () => {
  const { useTemplifyForm } = useTemplifyFormContext()

  const {
    formStore: { formTemplate },
  } = useTemplifyForm()

  return (
    <Form className="templifyForm">
      {formTemplate?.map((item) => {
        return <TemplifyFormItem key={item.prop} prop={item.prop}></TemplifyFormItem>
      })}
    </Form>
  )
}
