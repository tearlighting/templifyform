import type { IBlocker } from "subpubPattern"

export class Blocker<TTopic extends string> implements IBlocker<TTopic> {
  private _listeners: Map<TTopic, Function[]> = new Map()
  subscribe(topic: TTopic, callback: Function) {
    if (!this._listeners.has(topic)) {
      this._listeners.set(topic, [])
    }
    const listenersAlias = this._listeners.get(topic)!
    listenersAlias.push(callback)
    return () => this.unsubscribe(topic, callback)
  }
  unsubscribe(topic: TTopic, callback: Function) {
    if (!this._listeners.has(topic)) return
    const listenersAlias = this._listeners.get(topic)!
    listenersAlias.splice(listenersAlias.indexOf(callback), 1)
  }
  publish(topic: TTopic, ...args: []) {
    const listeners = this._listeners.get(topic) || []
    listeners.forEach((listener) => listener(...args))
  }
}
