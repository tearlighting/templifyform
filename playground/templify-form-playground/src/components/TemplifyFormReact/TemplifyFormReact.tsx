import type { IFormTemplateItem, I18nResolveCxt } from "templify-form"
import { useEffect, useState, Fragment } from "react"
import { Form, Input } from "antd"
import { useLanguage } from "@/hooks/useLanguageReact"

interface ITemplifyFormProps<TProps extends string = string, TResolveCxt = any, TFormData extends Record<TProps, any> = any> {
  template: IFormTemplateItem<TProps, TResolveCxt, TFormData>[]
  formData: Record<TProps, any>
  setField: (key: TProps, value: any) => void
  renderItems?: Record<TProps, (...args: any) => React.ReactNode>
}
export function TemplifyForm<TProps extends string = string, TResolveCxt extends I18nResolveCxt = any, TFormData extends Record<TProps, any> = any>({
  template,
  formData,
  setField,
  renderItems,
}: ITemplifyFormProps<TProps, TResolveCxt, TFormData>) {
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
          return <Fragment key={item.prop}>{item.render(item, formData as any, t, setField)}</Fragment>
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
            <Input size="large" value={formData[item.prop]} onChange={(e) => setField(item.prop, e.target.value)} className={item.formItemContentClassName} />
          </Form.Item>
        )
      })}
    </Form>
  )
}
