import { useCallback, useEffect } from "react"

import { Button, notification } from "antd"

import { TemplifyForm } from "@/components/TemplifyForm"

import { useFormStore } from "./demoNew"
import { useLanguage } from "./hooks/useLanguage"

function App() {
  const {
    setField,
    enableAutoValidate,
    setError,
    reset,
    formStore: { formData, formTemplate, isValid, errors },
  } = useFormStore()
  useFormStore((s) => s.formStore.formData)

  const { setLocale } = useLanguage()
  const [api, contextHolder] = notification.useNotification()

  const submitNotification = useCallback(() => {
    api.open({
      message: "Success",
      description: JSON.stringify(formData),
      type: "success",
      duration: 2000,
    })
  }, [formData])
  const showErrors = useCallback(() => {
    api.open({
      message: "Error",
      description: JSON.stringify(errors),
      type: "error",
      duration: 2000,
    })
  }, [errors])

  const clear = useCallback(() => {
    reset({})
  }, [])
  useEffect(() => {
    enableAutoValidate()
  }, [])
  return (
    <div className="demo-container">
      {contextHolder}
      <TemplifyForm formData={formData} template={formTemplate as any} setField={setField}></TemplifyForm>
      <div>
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
          <Button size="large" type="primary" onClick={() => setLocale("zh")}>
            中文
          </Button>
          <Button size="large" type="primary" onClick={() => setLocale("jp")}>
            日本語
          </Button>
          <Button size="large" type="primary" onClick={() => setLocale("en")}>
            English
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
