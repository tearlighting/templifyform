import "./App.css"
import { Form, Select, Input, Button } from "antd"
import { useForm, ETemplateType } from "./demo"

function App() {
  const { watch, formData, formTemplate, setValue, handleSubmit } = useForm()

  function submit() {
    handleSubmit((data) => {
      //   console.log(data)
      console.log("submit")
    })
  }

  return (
    <>
      <Form>
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
      </Form>
    </>
  )
}

export default App
