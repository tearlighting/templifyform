import { useCallback, useEffect, useEffectEvent, useRef } from "react"

import { Button, Form, Input, notification } from "antd"

import { TemplifyForm } from "@/components/TemplifyForm"

import { citys, useFormStoreFactory } from "./demoNew"
import { useLanguage } from "./hooks/useLanguage"
import { useTemplifyForm } from "./context/TemplifyFormProvider"
import { useRenderCount } from "./hooks/useRenderCount"
import type { IFormTemplateItem } from "../../../../types/templify-form"
const Password = () => {
  const { storeFactory } = useTemplifyForm()
  const { t } = useLanguage()
  const {
    formStore: { formTemplate },
    setField,
  } = storeFactory()
  const prop = "password"
  const item = formTemplate?.find((item) => item.prop === prop)!
  const value = storeFactory((s) => s.formStore.formData[prop]) as any
  const renderTimes = useRenderCount()

  return (
    <Form.Item
      label={<span className={item.formItemLabelClassName}>{item.label.resolve({ t })}</span>}
      help={item.error.resolve({ t })}
      validateStatus={item.error.resolve({ t }) ? "error" : ""}
      className={`templifyFormItem ${item.formItemClassName}`}
    >
      <div style={{ display: "flex" }}>
        <div>
          <Input.Password size="large" value={value} onChange={(e) => setField?.(item.prop, e.target.value)} className={item.formItemContentClassName} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>render time: {renderTimes}</span>
        </div>
      </div>
    </Form.Item>
  )
}

function App() {
  const { enableAutoValidate } = useFormStoreFactory()
  useEffect(() => {
    enableAutoValidate()
  }, [])

  const customFieldsRef = useRef({
    password: Password,
  })
  return (
    <div className="demo-container">
      <TemplifyForm storeFactory={useFormStoreFactory as any} customFields={customFieldsRef.current}></TemplifyForm>
      <Footer></Footer>
    </div>
  )
}

const Footer = () => {
  const { setLocale, currentLanguage } = useLanguage()

  const [api, contextHolder] = notification.useNotification()
  const {
    reset,
    setError,
    formStore: { formData, errors },
    setFormTemplate,
    setField,
  } = useFormStoreFactory()

  const isValid = useFormStoreFactory((s) => s.formStore.isValid)
  const country = useFormStoreFactory((s) => s.formStore.formData.country)

  useEffect(() => {
    setFormTemplate({
      city: ({ formTemplate }: { formTemplate: IFormTemplateItem<any, any, any>[] }) => {
        const item = formTemplate.find((item) => item.prop === "city")!
        item.option = citys[country.toLowerCase() as keyof typeof citys]
        const values = item.option.map((item) => item.value)
        if (!values.includes(formData.city)) {
          setField("city", "")
        }
        return item
      },
    })
  }, [country])

  const submitNotification = useEffectEvent(() => {
    api.open({
      message: "Success",
      description: JSON.stringify(formData),
      type: "success",
      duration: 2000,
    })
  })
  const showErrors = useEffectEvent(() => {
    api.open({
      message: "Error",
      description: JSON.stringify(errors),
      type: "error",
      duration: 2000,
    })
  })

  const clear = useCallback(() => {
    reset({})
  }, [])
  return (
    <div className="footer">
      {contextHolder}
      <div className="buttonsWrapper">
        <label>isValid:</label>
        <Button size="large" type="primary" disabled={!isValid} onClick={submitNotification}>
          submit
        </Button>
        <Button size="large" type="primary" onClick={clear}>
          reset
        </Button>
      </div>
      <div className="buttonsWrapper">
        <label>setError:</label>
        <Button size="large" type="primary" onClick={() => setError("code", "manual error")}>
          setError
        </Button>
        <Button size="large" type="primary" disabled={isValid} onClick={showErrors}>
          errors
        </Button>
      </div>
      <div className="buttonsWrapper">
        <label>Language: </label>

        <Button size="large" type="primary" className={currentLanguage === "zh" ? "isActive" : ""} onClick={() => setLocale("zh")}>
          中文
        </Button>
        <Button size="large" type="primary" className={currentLanguage === "jp" ? "isActive" : ""} onClick={() => setLocale("jp")}>
          日本語
        </Button>
        <Button size="large" type="primary" className={currentLanguage === "en" ? "isActive" : ""} onClick={() => setLocale("en")}>
          English
        </Button>
      </div>
    </div>
  )
}
export default App
