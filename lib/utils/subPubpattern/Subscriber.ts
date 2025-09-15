import type { IBlocker, ISubscriber } from "subpubPattern"

export class Subscriber<TTopic extends string> implements ISubscriber<TTopic> {
  constructor(private _blocker: IBlocker<TTopic>) {}
  subscribe(topic: TTopic, callback: (data: any) => void) {
    const unsubscribe = this._blocker.subscribe(topic, callback)
    return () => {
      unsubscribe()
    }
  }
  unsubscribe(topic: TTopic, callback: (data: any) => void) {
    this._blocker.unsubscribe(topic, callback)
  }
}
