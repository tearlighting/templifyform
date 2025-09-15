export interface IBlocker<TTopic extends string> {
  subscribe: (topic: TTopic, callback: Function) => () => void // unsubscribe
  unsubscribe(topic: TTopic, callback: (data: any) => void): void
  publish: (topic: TTopic, ...args: any[]) => void
}

export interface IPublisher<TTopic extends string> {
  publish(topic: TTopic, ...args: any[]): void
}
export interface ISubscriber<TTopic extends string> {
  subscribe(topic: TTopic, callback: (data: any) => void): () => void // return unsubscribe function
  unsubscribe(topic: TTopic, callback: (data: any) => void): void
}
