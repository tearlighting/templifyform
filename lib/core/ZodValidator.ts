import { ZodObject, z } from "zod"
import { ETemplateTopic } from "../constants/templateTopic"
import type { IPublisher, ISubscriber } from "subpubPattern"
import { Blocker, Publisher, Subscriber } from "../utils/subPubpattern"
export class ZodValidator<TScheme extends ZodObject, TProp extends string = keyof z.infer<TScheme> & string> {
  constructor(private readonly _zodSchema: TScheme, private _formData: z.infer<TScheme>, private _publisher: IPublisher<ETemplateTopic>, private _subscriber: ISubscriber<ETemplateTopic>) {}
  setValue(key: TProp, value: any) {
    this._formData[key as unknown as keyof typeof this._formData] = value
  }

  getValue(key: TProp) {
    return this._formData[key as unknown as keyof typeof this._formData]
  }
  reset(defaultValues: Partial<z.infer<TScheme>>) {
    for (const key in this._formData) {
      this._formData[key as keyof typeof this._formData] = defaultValues[key as keyof typeof defaultValues] ?? (null as any)
    }
  }
  validateAll() {
    const { error, success } = this._zodSchema.safeParse(this._formData)
    if (success) {
      return { error: null, valid: success }
    } else {
      const errorNew = error!.issues.reduce((acc, err) => {
        const fieldName = err.path.join(".")
        acc[fieldName as TProp] = err.message
        return acc
      }, {} as Record<TProp, string>)
      return { error: errorNew, valid: success }
    }
  }
  get formData() {
    return { ...this._formData }
  }
  subscribe(callback: (res: { error: Record<TProp, string> | null; valid: boolean }, prop?: TProp) => void) {
    return this._subscriber.subscribe(ETemplateTopic.templateTopic, callback)
  }
  private publish(res: { error: Record<TProp, string> | null; valid: boolean }, prop?: TProp) {
    this._publisher.publish(ETemplateTopic.templateTopic, res, prop)
  }
  runValidation(prop?: TProp) {
    const res = this.validateAll()
    this.publish(res, prop)
  }
  //   validate(prop: TProp) {
  //     const fieldSchema = this._zodSchema.shape[prop]
  //     const { success, error } = fieldSchema.safeParse(this._formData[prop as unknown as keyof typeof this._formData])
  //     return success ? { error: null, valid: true } : { error: { [prop]: error!.issues[0].message } as Record<TProp, string>, valid: false }
  //   }
}

export const createZodValidator = <TScheme extends ZodObject, TForm extends z.infer<TScheme>>(zodSchema: TScheme, formData: TForm) => {
  const blocker = new Blocker()
  const publisher = new Publisher<ETemplateTopic>(blocker)
  const subscriber = new Subscriber<ETemplateTopic>(blocker)
  return new ZodValidator(zodSchema, formData, publisher, subscriber)
}
