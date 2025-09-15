export class ResolvableValue<TCtx = any> {
  constructor(private _value: string = "", protected _transformer: (ctx: TCtx, value: string) => string = (_, value) => value) {}
  setValue(value: string) {
    this._value = value
  }
  resolve(ctx: TCtx) {
    return this._transformer(ctx, this._value)
  }
}
