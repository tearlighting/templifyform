import { useForm } from "./demoNew"
import { TemplifyForm } from "@/components/TemplifyForm"
import { Button, notification } from "antd"
import { useLanguage } from "./hooks/useLanguage"
import { useCallback, useEffect } from "react"

function App() {
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
    <div className="demo-container">
      {/* <Form>
        {formTemplate.map((item) => {
          return (
            <Form.Item label={item.label} key={item.prop} validateStatus={item.error ? "error" : undefined} help={item.error}>
              {item.type === ETemplateType.select ? (
                <Select value={formData[item.prop]} options={item.option} onChange={(v) => setValue(item.prop, v)}></Select>
              ) : (
                <Input value={formData[item.prop]} onChange={(v) => setValue(item.prop, v.target.value)}></Input>
              )}
            </Form.Item>
          )
        })}
        <Form.Item>
          <Button type="primary" onClick={submit}>
            提交
          </Button>
        </Form.Item>
      </Form> */}
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
