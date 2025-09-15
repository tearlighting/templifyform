import type { IResolvableValueRestable } from "templifyFormNew"
import { ResolvableValue } from "./ResolvableValue"

export class ResolvableValueRestable<TCtx = any> extends ResolvableValue<TCtx> implements IResolvableValueRestable {
  private _isResting = false
  rest() {
    this._isResting = true
  }
  show(): void {
    this._isResting = false
  }
  resolve(ctx: TCtx): string {
    if (this._isResting) return ""
    return super.resolve(ctx)
  }
}
