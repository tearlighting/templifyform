# TemplifyForm

一个简单灵活的动态表单生成器。OOP 重构 Core 内容，vue,react 的 hooks 实现，统一数据结构及参数。
通过 OOP 抽象 + ResolvableValue，实现了 Vue / React 双端可用的表单生成与校验。

---

## ✨ 特点

### Core 与皮肤解耦

core 只关心数据流与验证（formData / formTemplate / validator）。

Vue/React 层只是“皮肤”，调用参数完全一致。

### i18n 解耦

t() 不直接绑定在 core。

通过 ResolvableValue 延迟解析，在渲染时注入上下文 (ctx)。

支持静态字符串 / 函数 / ResolvableValue。

### zod 管理表单状态

个人感觉 zod 还是挺好用的，之前有段时间喜欢用 class 的装饰器，现在发现 zod 好像更舒服。

### 统一 API 以及 typescript 强类型注释

setFormData / setError / validateField / reset …

Vue: 注入响应式数据，自动监听。

React: useSyncExternalStore 注入，自己管理状态。

### 自动监听策略差异

Vue：watch 是微任务，nextTick 是宏任务。reset 后能 cover 所有微任务，避免不一致。

React：全量同步，useSyncExternalStore 注入。通过手动管理 getSnapshot，在 publish 时触发更新。
React 侧不需要深比较，直接全量更新，保证简单可控。

## 📦 安装

（即将发布到 npm）

## 使用

定义方法完全一样，只是 Vue / React 具体渲染看个人喜欢。详见 demo

```ts
//定义
const props = ["userName", "password", "code"] as const

const zodMap = createZodErrorMap<(typeof props)[number], TI18nKey>()({
  userName: {
    max: "userName.errors.maxLength",
    min: "userName.errors.required",
  },
  password: {
    max: "password.errors.maxLength",
    min: "password.errors.required",
  },
  code: {
    min: "code.errors.required",
  },
})

export const useForm = createUseTemplifyFormWithI18nResolvor({
  formTemplatePayload: {
    props: [...props],
    labels: {
      userName: ({ t }) => t("userName"),
      password: ({ t }) => t("password"),
      code: ({ t }) => t("code"),
    },
    formItemLabelClassNames: {
      userName: "formLabel",
      password: "formLabel",
      code: "formLabel",
    },
    renders: {
      password: (_, item, formData, t, setFiled) => {
        return (
          <Form.Item
            key={item.prop}
            label={<span className={item.formItemLabelClassName}>{item.label.resolve({ t })}</span>}
            help={item.error.resolve({ t })}
            validateStatus={item.error.resolve({ t }) ? "error" : ""}
            className={item.formItemClassName}
          >
            <Input.Password size="large" value={formData[item.prop]} onChange={(e) => setFiled?.(item.prop, e.target.value)} className={item.formItemContentClassName} />
          </Form.Item>
        )
      },
    },
    errors: {
      password: ({ t }, value) => {
        return value && t(value as TI18nKey)
      },
      userName: ({ t }, value) => {
        return value && t(value as TI18nKey)
      },
      code: ({ t }, value) => {
        return value && t(value as TI18nKey)
      },
    },
  },
  formDataPayload: {
    shapes: {
      userName: z.string().max(10, zodMap.userName.max).min(1, zodMap.userName.min),
      password: z.string().max(10, zodMap.password.max).min(1, zodMap.password.min),
      code: z.string().length(4, zodMap.code.min),
    },
    defaultValues: {
      userName: "admin",
      password: "123456",
      code: "1234",
    },
  },
})
```

### vue 的 使用

```ts
const { formData, formTemplate, isValid, enableAutoValidate, setError, reset, errors } = useForm()
//监听formData
enableAutoValidate()

 //TemplifyForm.vue
interface ITemplifyFormProps<TProps extends string = string, TResolveCxt = any> {
	template: IFormTemplateItem<TProps, TResolveCxt, Record<TProps, any>>[]
	formData: Record<TProps, any>
}
const props = defineProps<ITemplifyFormProps>()
const { t } = useLanguage()

  <ElForm>
		      <template v-for="item of props.template" :key="item.prop">
				<template v-if="item.render">
					<component :is="item.render(item, formData, t)"></component>
				</template>
				<template v-else>
					<ElFormItem :prop="item.prop" :error="item.error.resolve({ t })" :class="item.formItemClassName">
						<template v-slot:label>
							<span :class="item.formItemLabelClassName">{{ item.label.resolve({ t }) }}</span>
						</template>
						<ElInput size="large" v-model="formData[item.prop]" :class="item.formItemContentClassName">
						</ElInput>
					</ElFormItem>
				</template>
			</template>
</ElForm>
```

### react 的 使用

```tsx
const { formData, formTemplate, setField, enableAutoValidate, isValid, setError, reset, errors } = useForm()
useEffect(() => {
  enableAutoValidate()
}, [])
//TemplifyForm.tsx
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
```

## ⚙️ 内部机制

### Vue

formData,formTemplate 是 reactive,将响应式数据注入到 core。主要是为了 cover v-model.

但是这样，自动监听用 watch 会产生异步的微任务，reset 时用 nextTick cover 微任务。

### React

formData 是 plain object。

状态用 useSyncExternalStore 注入。

getSnapshot 手动维护，publish 时强制 null → 缓存更新。

不深比较，直接全量刷新。

## 🔮 总结

Core：OOP + ResolvableValue，跨框架可复用

Vue：响应式驱动

React：store + useSyncExternalStore 驱动

参数一致，皮肤不同

## 许可

MIT License
