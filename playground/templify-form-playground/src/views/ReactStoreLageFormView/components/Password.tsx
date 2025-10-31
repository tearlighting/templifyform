import { useTemplifyFieldSubscription, useTemplifyFormContext } from "@/components/TemplifyFormReact/TemplifyForm"
import { useLanguage } from "@/hooks/useLanguageReact"
import { useRenderCount } from "@/hooks/useRenderCount"
import { Form, Input } from "antd"

export const Password = () => {
  const { useTemplifyForm } = useTemplifyFormContext()
  const { t } = useLanguage()
  const {
    formStore: { formTemplate },
    setField,
  } = useTemplifyForm()
  const prop = "password"
  const item = formTemplate?.find((item) => item.prop === prop)!
  const value = useTemplifyForm((s) => s.formStore.formData[prop]) as any
  const renderTimes = useRenderCount()
  useTemplifyFieldSubscription({
    prop,
  })

  return (
    <Form.Item
      label={<span className={item.formItemLabelClassName}>{item.label.resolve({ t })}</span>}
      help={item.error.resolve({ t })}
      validateStatus={item.error.resolve({ t }) ? "error" : ""}
      className={`templifyFormItem ${item.formItemClassName}`}
    >
      <div className="flex">
        <div className="flex-1">
          <Input.Password size="large" style={{ width: "100%" }} value={value} onChange={(e) => setField?.(item.prop, e.target.value)} className={item.formItemContentClassName} />
        </div>
        <div className="flex items-center text-text text-[12px]">
          <span>renderTimes: {renderTimes}</span>
        </div>
      </div>
    </Form.Item>
  )
}
