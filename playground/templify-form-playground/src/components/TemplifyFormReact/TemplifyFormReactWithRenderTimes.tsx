import type { IFormTemplateItem, I18nResolveCxt } from "templify-form"
import { useEffect, useState, Fragment, useRef } from "react"
import { Form, Input } from "antd"
import { useLanguage } from "@/hooks/useLanguageReact"
import { useRenderCount } from "@/hooks/useRenderCount"

interface ITemplifyFormProps<TProps extends string = string, TResolveCxt = any, TFormData extends Record<TProps, any> = any> {
  template: IFormTemplateItem<TProps, TResolveCxt, TFormData>[]
  formData: Record<TProps, any>
  setField: (key: TProps, value: any) => void
}
export function TemplifyForm<TProps extends string = string, TResolveCxt extends I18nResolveCxt = any, TFormData extends Record<TProps, any> = any>({
  template,
  formData,
  setField,
}: ITemplifyFormProps<TProps, TResolveCxt, TFormData>) {
  const renderTimes = useRenderCount()
  const [canRender, setCanRender] = useState(false)
  const { t } = useLanguage()
  useEffect(() => {
    setCanRender(true)
  }, [])
  return (
    <Form>
      {template.map((item) => {
        if (item.render && canRender) {
          // 自定义渲染
          return (
            <div key={item.prop} style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <Fragment key={item.prop}>{item.render(item, formData as any, t, setField)}</Fragment>
              </div>
              <div className="text-text">
                <span>render time: {renderTimes}</span>
              </div>
            </div>
          )
        }

        return (
          <Form.Item
            key={item.prop}
            label={<span className={item.formItemLabelClassName}>{item.label.resolve({ t } as TResolveCxt)}</span>}
            help={item.error.resolve({ t } as TResolveCxt)}
            validateStatus={item.error.resolve({ t } as TResolveCxt) ? "error" : ""}
            className={item.formItemClassName}
          >
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <Input size="large" value={formData[item.prop]} onChange={(e) => setField(item.prop, e.target.value)} className={item.formItemContentClassName} />
              </div>
              <div className="text-text">
                <span>render time: {renderTimes}</span>
              </div>
            </div>
          </Form.Item>
        )
      })}
    </Form>
  )
}
