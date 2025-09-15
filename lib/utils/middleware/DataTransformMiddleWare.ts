export class TransformMiddleWare<I, R = I> {
  private _stack: Array<(input: any) => any | Promise<any>> = []

  use<T>(fn: (input: R) => T | Promise<T>): TransformMiddleWare<I, T> {
    this._stack.push(fn)
    return this as unknown as TransformMiddleWare<I, T>
  }

  async run(input: I): Promise<R> {
    let result: any = input
    for (const fn of this._stack) {
      result = await fn(result)
    }
    return result
  }
}
export class SyncTransformMiddleWare<I, R = I> {
  private _stack: Array<(input: any) => any> = []

  use<T>(fn: (input: R) => T) {
    this._stack.push(fn)
    return this as unknown as SyncTransformMiddleWare<I, T>
  }

  run(input: I): R {
    let result: any = input
    for (const fn of this._stack) {
      result = fn(result)
    }
    return result
  }
}

export const createTransformMiddleWare = <I, R = I>() => new TransformMiddleWare<I, R>()
export const createSyncTransformMiddleWare = <I, R = I>() => new SyncTransformMiddleWare<I, R>()
