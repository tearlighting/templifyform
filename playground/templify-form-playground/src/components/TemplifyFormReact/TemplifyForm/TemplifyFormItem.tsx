import { useLanguage } from "@/hooks/useLanguageReact"
import { Form, Input, Select, DatePicker, Switch, Checkbox, ColorPicker } from "antd"

import { useTemplifyForm } from "./context"
import { ETemplateType } from "templify-form"
import { NumericInput } from "./NumericInput"
import { useRenderCount } from "@/hooks/useRenderCount"
import dayjs from "dayjs"
import { useTemplifyFieldSubscription } from "./hooks"
export const TemplifyFormItem = ({ prop }: { prop: string }) => {
  const { customFields } = useTemplifyForm()
  return <>{customFields![prop] ? customFields![prop] : <DefaultFormItem prop={prop} />}</>
}

const DefaultFormItem = ({ prop }: { prop: string }) => {
  const { t } = useLanguage()
  useTemplifyFieldSubscription({ prop })
  const { formStore: storeFactory } = useTemplifyForm()
  const {
    formStore: { formTemplate },
    setField,
  } = storeFactory()
  const value = storeFactory((s) => s.formStore.formData[prop]) as any

  const item = formTemplate?.find((item) => item.prop === prop)!

  const renderTimes = useRenderCount()

  return (
    <Form.Item
      label={<span className={item.formItemLabelClassName}>{item.label.resolve({ t })}</span>}
      help={item.error.resolve({ t })}
      validateStatus={item.error.resolve({ t }) ? "error" : ""}
      className={`templifyFormItem ${item.formItemClassName}`}
    >
      <div className="flex">
        <div className="flex-1">
          {item.type === ETemplateType.input && <Input size="large" value={value} onChange={(e) => setField(item.prop, e.target.value)} className={item.formItemContentClassName} />}
          {item.type === ETemplateType.select && (
            <Select
              size="large"
              value={value}
              options={item.option.map((o) => ({ label: o.label.resolve({ t }), value: o.value }))}
              onChange={(e) => setField(item.prop, e)}
              className={item.formItemContentClassName}
            />
          )}
          {item.type === ETemplateType.date && (
            <DatePicker style={{ width: "100%" }} size="large" value={value ? dayjs(value) : undefined} onChange={(_, e) => setField(item.prop, e)} className={item.formItemContentClassName} />
          )}
          {item.type === ETemplateType.switch && <Switch style={{ marginLeft: "1em" }} checked={value} onChange={(e) => setField(item.prop, e)} className={item.formItemContentClassName} />}
          {item.type === ETemplateType.textarea && <Input.TextArea size="large" value={value} onChange={(e) => setField(item.prop, e.target.value)} className={item.formItemContentClassName} />}
          {item.type === ETemplateType.checkbox && <Checkbox checked={value} onChange={(e) => setField(item.prop, e.target.checked)} className={item.formItemContentClassName} />}
          {item.type === ETemplateType.number && <NumericInput value={value} onChange={(e) => setField(item.prop, e)} className={item.formItemContentClassName} />}
          {item.type === ETemplateType.color && <ColorPicker value={value} onChange={(_, e) => setField(item.prop, e)} className={item.formItemContentClassName} />}
        </div>
        <div className="flex items-center text-text">
          <span>render time: {renderTimes}</span>
        </div>
      </div>
    </Form.Item>
  )
}
