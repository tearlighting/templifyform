import { IFormTemplateItem } from "../../../../../types/templify-form"
import { I18nResolveCxt } from "index"
import { Fragment, useEffect, useRef, useState } from "react"
import { Form, Input } from "antd"
import { useLanguage } from "@/hooks/useLanguage"
import { TI18nKey } from "language"

interface ITemplifyFormProps<TProps extends string = string, TResolveCxt = any, TFormData extends Record<TProps, any> = any> {
  template: IFormTemplateItem<TProps, TResolveCxt, TFormData>[]
  formData: Record<TProps, any>
  setField: (key: TProps, value: any) => void
  renderItems?: Record<
    TProps,
    (item: IFormTemplateItem<TProps, TResolveCxt, TFormData>, formData: TFormData, t: (key: TI18nKey) => string, setField: (key: TProps, value: any) => void) => React.ReactNode
  >
}
export function TemplifyForm<TProps extends string = string, TResolveCxt extends I18nResolveCxt = any, TFormData extends Record<TProps, any> = any>({
  template,
  formData,
  setField,
  renderItems,
}: ITemplifyFormProps<TProps, TResolveCxt, TFormData>) {
  const renderTimesRef = useRef(0)
  renderTimesRef.current += 1
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
              <div>
                <span>render time: {renderTimesRef.current}</span>
              </div>
            </div>
          )
        }
        if (renderItems?.[item.prop] && canRender) {
          return <Fragment key={item.prop}>{renderItems[item.prop](item, formData as any, t, setField)}</Fragment>
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
              <div>
                <span>render time: {renderTimesRef.current}</span>
              </div>
            </div>
          </Form.Item>
        )
      })}
    </Form>
  )
}
