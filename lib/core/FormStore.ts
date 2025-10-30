import {
  Blocker,
  Publisher,
  Subscriber,
} from '#/utils/subPubpattern';
import type {
  IPublisher,
  ISubscriber,
} from 'subpubPattern';
import type { IFormTemplateItem } from 'templify-form';
import type {
  z,
  ZodObject,
} from 'zod';

// import type { IValidator } from './ZodValidator';
import { ETemplifyFormChange } from "#/constants";
import type { IValidator } from "./ZodValidator";

export interface IFormStore<
  TScheme extends ZodObject<any>,
  TResolveCxt extends any,
  TFormData extends z.infer<TScheme> = z.infer<TScheme>,
  TKey extends string & keyof z.infer<TScheme> = string & keyof z.infer<TScheme>,
  TFormTemplate extends IFormTemplateItem<TKey, TResolveCxt, TFormData> = IFormTemplateItem<TKey, TResolveCxt, TFormData>
> {
  /**
   * publish 单行错误
   * @param prop
   * @returns
   */
  validateField: (prop: TKey) => void
  /**
   *
   * publish 所有错误
   */
  validateAll: () => void
  /**
   * 手动设置错误并publish
   * @param key
   * @param error
   * @returns
   */
  setError: (key: TKey, error: string) => void
  /**
   * 重新设置formData,并清空所有错误,最后publish
   */
  reset(data?: Partial<TFormData>): void
  getSnapshot(): Readonly<{
    readonly isValid: boolean
    readonly errors: Partial<Record<TKey, string>>
    readonly formData: TFormData
    readonly formTemplate: TFormTemplate[]
  }>
  /**
   * 设置formData,并publish,react的change事件用
   * @param data
   * @param needPublish 是否触发publish，假如我是自动触发错误的，那我这里其实触发是没有意义的
   * @returns
   */
  setFormData: (data: Partial<TFormData>, needPublish?: boolean) => void
  /**
   * 设置formTemplate,并publish,react修改表单结构用
   */
  setFormTemplate: (
    data: Partial<Record<TKey, Partial<IFormTemplateItem<TKey, TResolveCxt, TFormData>> | ((payload: { formTemplate: TFormTemplate[] }) => Partial<IFormTemplateItem<TKey, TResolveCxt, TFormData>>)>>
  ) => void
}
export class FormStore<
  TScheme extends ZodObject<any>,
  TResolveCxt extends any,
  TFormData extends z.infer<TScheme> = z.infer<TScheme>,
  TKey extends string & keyof z.infer<TScheme> = string & keyof z.infer<TScheme>,
  TFormTemplate extends IFormTemplateItem<TKey, TResolveCxt, TFormData> = IFormTemplateItem<TKey, TResolveCxt, TFormData>
> implements IFormStore<TScheme, TResolveCxt, TFormData, TKey, TFormTemplate> {
  private _isValid = false
  private _errors: Partial<Record<TKey, string>> = {}
  private _subscriber: ISubscriber<ETemplifyFormChange>
  private _publisher: IPublisher<ETemplifyFormChange>
  // private _unsubscribeValidator?: () => void
  private _snapshotCache: {
    isValid: boolean
    errors: Partial<Record<TKey, string>>
    formData: TFormData
    formTemplate: TFormTemplate[]
  } | null = null
  constructor(private _formTemplate: TFormTemplate[], private _formData: TFormData, private _validator: IValidator<TFormData>) {
    const blocker = new Blocker<ETemplifyFormChange>()
    this._publisher = new Publisher(blocker)
    this._subscriber = new Subscriber(blocker)
    this.init()
  }

  //#region 
  private init() {
    this.setValidation()
    // this._unsubscribeValidator = this.setupValidation()
  }
  // private setupValidation() {
  //   // 订阅 validator，更新 errors/valid
  //   return this._validator.subscribe(({ valid, error }, prop) => {
  //     const nonNullErrors: Partial<Record<TKey, string>> = error ?? {}
  //     if (prop) {
  //       // 单行更新
  //       const item = this._formTemplate.find((x) => x.prop === prop)
  //       if (!item) return
  //       item.error.show()
  //       item.error.setValue(nonNullErrors[prop] ?? "")
  //     } else {
  //       // 全量更新
  //       for (const item of this._formTemplate) {
  //         item.error.show()
  //         item.error.setValue(nonNullErrors[item.prop] ?? "")
  //       }
  //     }
  //     this._isValid = valid
  //     this._errors = nonNullErrors
  //     this.publish()
  //   })
  // }

  private setValidation() {
    const res = this._validator.validate(this._formData)
    this._isValid = res.valid
    if (res.valid) {
      this._errors = {}
    } else {
      this._errors = { ...res.error }
    }
  }
  private publish() {
    this._snapshotCache = null
    this._publisher.publish(ETemplifyFormChange.formDataChange, this.getSnapshot())
  }

  subscribe(callback: (payload: ReturnType<FormStore<TScheme, TResolveCxt, TFormData, TKey, TFormTemplate>["getSnapshot"]>) => void) {
    const unsubscribe = this._subscriber.subscribe(ETemplifyFormChange.formDataChange, callback)
    //react是多次执行，可能把这个干掉了，需要重新订阅
    // if (!this._unsubscribeValidator) {
    //   this._unsubscribeValidator = this.setupValidation()
    // }

    return () => {
      // this._unsubscribeValidator?.()
      unsubscribe()
      // this._unsubscribeValidator = undefined
    }
  }
  getSnapshot() {
    if (!this._snapshotCache)
      this._snapshotCache = Object.freeze({
        isValid: this._isValid,
        errors: { ...this._errors },
        formData: { ...this._formData },
        formTemplate: this._formTemplate.map((item) => ({ ...item })),
      } as const)
    return this._snapshotCache!
  }
  //#endregion
  validateField(prop: TKey) {
    // this._validator.runValidation(prop)
    this.setValidation()
    const item = this._formTemplate.find((x) => x.prop === prop)
    if (!item) return
    item.error.show()
    item.error.setValue(this._errors[prop] ?? "")
    this.publish()
  }

  validateAll() {
    this.setValidation()
    for (const item of this._formTemplate) {
      item.error.show()
      item.error.setValue(this._errors[item.prop] ?? "")
    }
    this.publish()
  }
  setError(key: TKey, error: string) {
    const item = this._formTemplate.find((item) => item.prop === key)
    if (!item) return
    this._errors[key] = error
    item.error.show()
    item.error.setValue(error)
    this._isValid = false
    this.publish()
  }

  reset(data?: Partial<TFormData>) {
    const defaultValues = data ?? {}
    for (const key in this._formData) {
      this._formData[key as keyof TFormData] = defaultValues[key as keyof typeof defaultValues] ?? null
    }
    this.setValidation()
    for (let item of this._formTemplate) {
      item.error.rest()
    }
    this.publish()
  }


  //#region  react用，vue的话我更推荐直接注入响应式数据
  setFormData(data: Partial<TFormData>, needPublish = true) {
    for (const key in data) {
      this._formData[key as keyof TFormData] = data[key as keyof typeof data]!
    }
    needPublish && this.publish()
  }

  setFormTemplate(
    data: Partial<Record<TKey, Partial<IFormTemplateItem<TKey, TResolveCxt, TFormData>> | ((payload: { formTemplate: TFormTemplate[] }) => Partial<IFormTemplateItem<TKey, TResolveCxt, TFormData>>)>>
  ) {
    for (let key in data) {
      const item = this._formTemplate.find((x) => x.prop === key)
      if (!item) continue
      const res = data[key]
      const newData = typeof res === "function" ? res({ formTemplate: this._formTemplate }) : res
      if (!newData) continue
      for (const key in newData) {
        const res = newData![key as keyof typeof newData]!
        item[key as keyof typeof newData] = res as any
      }
    }
    this.publish()
  }
  //#endregion

}

export const createFormStore = <
  TScheme extends ZodObject<any>,
  TResolveCxt extends any,
  TFormData extends z.infer<TScheme>,
  TKey extends string & keyof z.infer<TScheme>,
  TFormTemplate extends IFormTemplateItem<TKey, TResolveCxt, TFormData>
>(
  formTemplate: TFormTemplate[],
  formData: TFormData,
  validator: IValidator<TFormData>
) => {
  return new FormStore<TScheme, TResolveCxt, TFormData, TKey, TFormTemplate>(formTemplate, formData, validator)
}
