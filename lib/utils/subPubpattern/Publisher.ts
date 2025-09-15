import type { IBlocker, IPublisher } from "subpubPattern"

export class Publisher<TTopic extends string> implements IPublisher<TTopic> {
  constructor(private _blocker: IBlocker<TTopic>) {}
  publish(topic: TTopic, ...args: any[]) {
    this._blocker.publish(topic, ...args)
  }
}
