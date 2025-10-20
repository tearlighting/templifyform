# TemplifyForm

A simple and flexible dynamic form generator.
Core is rebuilt with OOP, and hooks are implemented for Vue and React.
Unified data structures and parameters are used across both frameworks.

With OOP abstraction + ResolvableValue, this enables dynamic form generation and validation in both Vue and React.

## Architecture Overview

```
               ┌────────────────────────────┐
               │         UI Layer           │
               │ ────────────────────────── │
               │  Components:               │
               │  - TemplifyForm            │
               │  - TemplifyFormItem        │
               │  - CustomField (Password…) │
               └────────────┬───────────────┘
                            │ uses
                            ▼
        ┌────────────────────────────────────────────┐
        │                 Hook Layer                 │
        │────────────────────────────────────────────│
        │ Vue:    useTemplifyForm()                  │
        │ React:  createUseTemplifyFormStore()       │
        │                                            │
        │ • Bridges Core → Framework reactivity(vue) │
        │ • Handles auto-validation and subscription │
        │ • Maintains reactive `formData`, `errors`, │
        │   and `isValid` state                      │
        └────────────────┬───────────────────────────┘
                         │ calls
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                            Core Layer                          │
│────────────────────────────────────────────────────────────────│
│ FormStore  →  manages data / template / error /isVaild state   │
│ ZodValidator → integrates zod schema validation                │
│ Publisher / Subscriber → decoupled event system (observer)     │
│                                                                │
│  Pure TypeScript logic (framework-agnostic)                    │
│  Tested via Vitest: FormStore.test.ts, ZodValidator.test.ts    │
└────────────────────────────────────────────────────────────────┘

```

## Data Flow

```

User Input
│
▼
Form Component
│ (calls)
▼
FormStore.setFormData()
│ (publishes)
▼
ZodValidator.runValidation()
│ (publishes)
▼
Subscribers (hooks) update reactive formData / errors / isValid
│
▼
UI auto-renders updated state
```

## ✨ Features

### Core decoupled from UI

The core only manages data flow and validation (formData / formTemplate / validator).
Vue/React layers are just skins, with exactly the same parameters.

### i18n Decoupling

t() is not bound directly to the core.

By using ResolvableValue, translation is deferred until render-time, with context (ctx) injected.

Supports static strings / functions / ResolvableValue.

### Form state management with Zod

Zod feels very handy for schema validation.
Previously, I preferred class decorators, but Zod has proven more comfortable for this use case.

### Unified API and TypeScript Strong Typing

setFormData / setError / validateField / reset …

Vue: injects reactive data, auto-listening with watch.

React: injects via useSyncExternalStore, with self-managed state.

### Different auto-listening strategies

Vue:
watch runs in microtasks; nextTick runs in macrotasks.
After reset, nextTick covers all microtasks to ensure consistency.

React:
Fully synchronous, injected via useSyncExternalStore.
By manually managing getSnapshot, publish forces null → cached value refresh.
No deep equality check needed; always update fully for simplicity and safety.

## 📦 Installation

（Coming soon）

## Usage

Definitions are exactly the same.
Rendering depends on Vue or React — see the demo.

```ts
// Definition
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

### Vue Usage

```ts
const { formStore: {
	formData, formTemplate, isValid, errors
}, enableAutoValidate, setError, reset, } = useForm()
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

### React Usage

```tsx
//reference stable
const {
  setField,
  enableAutoValidate,
  setError,
  reset,
  formStore: { formData, formTemplate, isValid, errors },
} = useFormStore()
//control callback by vue's effect and reactivity
useFormStore((s) => s.formStore.formData)
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

## react large form

```tsx
const { enableAutoValidate } = useFormStoreFactory()
useEffect(() => {
  enableAutoValidate()
}, [])

 <TemplifyForm storeFactory={useFormStoreFactory as any} customFields={customFieldsRef.current}></TemplifyForm>



const context = createContext<null | ITemplifyFormProvider>(null)

export const TemplifyFormProvider = ({ children, value }: { children: React.ReactNode; value: ITemplifyFormProvider }) => {
  return <context.Provider value={value}>{children}</context.Provider>
}

export const useTemplifyForm = () => {
  const store = useContext(context)
  if (!store) throw new Error("useTemplifyForm must be used within a TemplifyFormProvider")
  return store
}
 export const TemplifyForm = ({ storeFactory, customFields }: ITemplifyFormProvider) => {
  const value = useMemo(() => {
    return {
      storeFactory,
      customFields: customFields ?? {},
    }
  }, [storeFactory, customFields])

  return (
    <TemplifyFormProvider value={value}>
      <TemplifyFormContent></TemplifyFormContent>
    </TemplifyFormProvider>
  )
}

export const TemplifyFormContent = () => {
  const { storeFactory } = useTemplifyForm()

  const {
    formStore: { formTemplate },
  } = storeFactory()

  return (
    <Form className="templifyForm">
      {formTemplate?.map((item) => {
        return <TemplifyFormItem key={item.prop} prop={item.prop}></TemplifyFormItem>
      })}
    </Form>
  )
}

export const TemplifyFormItem = ({ prop }: { prop: string }) => {
  const { customFields } = useTemplifyForm()
  return <>{customFields![prop] ? customFields![prop]() : <DefaultFormItem prop={prop} />}</>
}

const DefaultFormItem = ({ prop }: { prop: string }) => {
  const { t } = useLanguage()
  useTemplifyFieldSubscription({ prop })
  const { storeFactory } = useTemplifyForm()
  const {
    formStore: { formTemplate },
    setField,
  } = storeFactory()
  const value = storeFactory((s) => s.formStore.formData[prop]) as any

  const item = formTemplate?.find((item) => item.prop === prop)!

  return
    <Form.Item
      label={<span className={item.formItemLabelClassName}>{item.label.resolve({ t })}</span>}
      help={item.error.resolve({ t })}
      validateStatus={item.error.resolve({ t }) ? "error" : ""}
      className={`templifyFormItem ${item.formItemClassName}`}
    >
          {item.type === ETemplateType.input && <Input size="large" value={value} onChange={(e) => setField(item.prop, e.target.value)} className={item.formItemContentClassName} />}
    </Form.Item>

}
```

## ⚙️ Internal Mechanism

### Vue

formData & formTemplate are reactive.

Injected into core for v-model support.

watch creates microtasks, nextTick (macrotask) ensures reset consistency.

### React

formData is plain object.

State managed via useSyncExternalStore.

getSnapshot maintained manually, publish triggers null → update.

No deep compare, always full refresh.

## 🔮 Summary

Core: OOP + ResolvableValue, cross-framework reuse

Vue: reactive-driven

React: store + useSyncExternalStore driven

Same parameters, different skins

## License

MIT License
