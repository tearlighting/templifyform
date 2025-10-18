import { TemplifyFormProvider, useTemplifyForm } from "@/context/TemplifyFormProvider"

import { Form } from "antd"
import { TemplifyFormItem } from "./TemplifyFormItem"
import { useMemo } from "react"
import { ITemplifyFormProvider } from "templifyProvider"

export const TemplifyForm = ({ storeFactory, customFields }: ITemplifyFormProvider) => {
  const value = useMemo(() => {
    return {
      storeFactory,
      customFields: customFields ?? {},
    }
  }, [storeFactory, customFields])

  return (
    <TemplifyFormProvider value={value}>
      <TemplifyFormContent></TemplifyFormContent>
    </TemplifyFormProvider>
  )
}

export const TemplifyFormContent = () => {
  const { storeFactory } = useTemplifyForm()

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
