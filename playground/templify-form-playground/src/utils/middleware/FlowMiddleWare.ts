// 泛型 T 用来传上下文类型，比如路由上下文、请求上下文等
export class FlowMiddleware<T = any> {
  private _stack: Array<(ctx: T, next: () => Promise<void>) => Promise<void> | void> = []

  use(fn: (ctx: T, next: () => Promise<void>) => Promise<void> | void) {
    this._stack.push(fn)
    return this
  }

  async run(ctx: T) {
    let index = -1

    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) throw new Error("next() called multiple times")
      index = i
      const fn = this._stack[i]
      if (fn) {
        await fn(ctx, () => dispatch(i + 1))
      }
    }
    await dispatch(0)
  }
}

export const createFlowMiddleware = <T>() => new FlowMiddleware<T>()
