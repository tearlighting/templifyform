import { ZodObject, ZodType, z } from "zod"
export class ZodValidator<TProp extends string, TScheme extends ZodObject<Record<TProp, ZodType>>> {
  private readonly _zodSchema: TScheme
  private _formData: z.infer<TScheme>
  private _listeners: Set<(res: { error: Record<TProp, string> | null; valid: boolean }) => void> = new Set()

  constructor(zodSchema: TScheme, formData: z.infer<TScheme>) {
    this._zodSchema = zodSchema
    this._formData = formData
  }
  setValue(key: TProp, value: any) {
    this._formData[key] = value
  }
  subscribe(callback: (res: { error: Record<TProp, string> | null; valid: boolean }) => void) {
    this._listeners.add(callback)
    return () => this._listeners.delete(callback)
  }
  private publish(res: { error: Record<TProp, string> | null; valid: boolean }) {
    this._listeners.forEach((listener) => listener(res))
  }
  watch() {
    const res = this.validate()
    this.publish(res)
  }
  getValue(key: TProp) {
    return this._formData[key]
  }
  reset(defaultValues: Partial<z.infer<TScheme>>) {
    for (const key in this._formData) {
      this._formData[key as keyof typeof this._formData] = defaultValues[key as keyof typeof defaultValues] ?? (null as any)
    }
  }
  validate() {
    const { error, success } = this._zodSchema.safeParse(this._formData)
    if (success) {
      return { error: null, valid: success }
    } else {
      const errorNew = error.errors.reduce((acc, err) => {
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
}
