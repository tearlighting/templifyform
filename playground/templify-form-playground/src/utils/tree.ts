interface ITree {
  children?: ITree[]
}
interface ISearchResult {
  needBreak: true
}
interface ISearch<T extends ITree> {
  (item: T): ISearchResult | void
}
interface ISearchAsync<T extends ITree> {
  (item: T): ISearchResult | void | Promise<ISearchResult | void>
}
export function dfs<T extends ITree>(payload: T[] | T, callback: ISearch<T>) {
  if (!payload) return
  const nomalizedPalylod = Array.isArray(payload) ? payload : [payload]
  for (let item of nomalizedPalylod) {
    const res = callback(item)
    if (res?.needBreak) break
    item.children?.length && dfs(item.children as T[], callback)
  }
}
export async function dfsASync<T extends ITree>(payload: T | T[], callback: ISearchAsync<T>) {
  if (!payload) return
  const nomalizedPalylod = Array.isArray(payload) ? payload : [payload]
  for (let item of nomalizedPalylod) {
    const res = await callback(item)
    if (res?.needBreak) break
    item.children?.length && (await dfsASync(item.children as T[], callback))
  }
}
export function bfs<T extends ITree>(payload: T | T[], callback: ISearch<T>): void {
  if (!payload) return
  const queue: T[] = Array.isArray(payload) ? [...payload] : [payload]
  while (queue.length) {
    const node = queue.shift()!
    const res = callback(node)
    if (res?.needBreak) break
    if (node.children?.length) {
      queue.push(...(node.children as T[]))
    }
  }
}

// 异步 BFS
export async function bfsAsync<T extends ITree>(payload: T | T[] | undefined, callback: ISearchAsync<T>): Promise<void> {
  if (!payload) return
  const queue: T[] = Array.isArray(payload) ? [...payload] : [payload]
  while (queue.length) {
    const node = queue.shift()!
    const res = await callback(node)
    if (res?.needBreak) break
    if (node.children?.length) {
      queue.push(...(node.children as T[]))
    }
  }
}
