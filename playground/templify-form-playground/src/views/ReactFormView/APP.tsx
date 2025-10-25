import { useForm } from "./hooks"
import { TemplifyForm } from "@/components/TemplifyFormReact/TemplifyFormReact"
import { Button, notification } from "antd"
import { useLanguage } from "@/hooks/useLanguageReact"
import { useCallback, useEffect } from "react"
export function App() {
  const { formData, formTemplate, setField, enableAutoValidate, isValid, setError, reset, errors } = useForm()
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
    <div className="demo-container w-full min-w-100 max-w-150 md:px-2 md:py-3">
      {contextHolder}
      <TemplifyForm formData={formData} template={formTemplate as any} setField={setField}></TemplifyForm>
      <div>
        <div className="mb-5">
          <label className="inline-block w-30 text-right pr-5 mr-3">isValid</label>
          <Button size="large" type="primary" disabled={!isValid} onClick={submitNotification}>
            submit
          </Button>
          <Button size="large" type="primary" onClick={clear} className="ml-3">
            clear
          </Button>
          <Button size="large" type="primary" onClick={() => reset()} className="ml-3">
            reset
          </Button>
        </div>
        <div className="mb-5 ">
          <label className="inline-block w-30 text-right pr-5 mr-3">setError</label>
          <Button size="large" type="primary" onClick={() => setError("code", "defaultForm.customError")}>
            setError
          </Button>
          <Button className="ml-3" size="large" type="primary" disabled={isValid} onClick={showErrors}>
            errors
          </Button>
        </div>
        <div className="mb-5 ">
          <label className="inline-block w-30 text-right pr-5 mr-3">Language </label>
          <Button size="large" type="primary" onClick={() => setLocale("zh")}>
            中文
          </Button>
          <Button className="ml-3" size="large" type="primary" onClick={() => setLocale("jp")}>
            日本語
          </Button>
          <Button className="ml-3" size="large" type="primary" onClick={() => setLocale("en")}>
            English
          </Button>
        </div>
      </div>
    </div>
  )
}
