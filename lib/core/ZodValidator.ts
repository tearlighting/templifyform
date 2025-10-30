import {
  Blocker,
  Publisher,
  Subscriber,
} from '#/utils/subPubpattern';
import {
  z,
  ZodObject,
} from 'zod';

import type {
  IPublisher,
  ISubscriber,
} from 'subpubPattern';

import { ETemplifyVaildatorTopic } from '#/constants';

export interface IValidator<TScheme extends ZodObject, TProp extends string = keyof z.infer<TScheme> & string> {
  validateAll(): { error: Record<TProp, string> | null; valid: boolean }
  runValidation(prop?: TProp): void
  subscribe(callback: (res: { error: Record<TProp, string> | null; valid: boolean }, prop?: TProp) => void): () => void
}

export class ZodValidator<TScheme extends ZodObject, TProp extends string = keyof z.infer<TScheme> & string> implements IValidator<TScheme, TProp> {
  private _publisher: IPublisher<ETemplifyVaildatorTopic>
  private _subscriber: ISubscriber<ETemplifyVaildatorTopic>
  constructor(private readonly _zodSchema: TScheme, private _formData: z.infer<TScheme>) {
    const blocker = new Blocker()
    this._publisher = new Publisher<ETemplifyVaildatorTopic>(blocker)
    this._subscriber = new Subscriber<ETemplifyVaildatorTopic>(blocker)
  }
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
    return this._subscriber.subscribe(ETemplifyVaildatorTopic.vaildate, callback)
  }
  private publish(res: { error: Record<TProp, string> | null; valid: boolean }, prop?: TProp) {
    this._publisher.publish(ETemplifyVaildatorTopic.vaildate, res, prop)
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

  return new ZodValidator(zodSchema, formData)
}
