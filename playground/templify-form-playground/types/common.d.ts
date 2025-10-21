/**
 * 联合 → 交叉
 * 主要是利用分发特性
 *
 * 直接写是不会分发的
 * ```ts
 * //string
 * type T = string|1 extends string?string:number
 * ```
 * 只有计算才会
 * ```
 * type Func<T> = T extends string?string:number
 * //string|number
 * type T = Func<string|1>
 * ```
 *
 * 交叉会融和在一起，暂时没有办法直接将联合类型变成交叉类型
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
 * 有时会因为鸭子辨析而出现一些奇奇怪怪的东西
 * ```ts
 * type T = {title:string}|{titleKey:string}
 * //正确
 * const t:T = {title:"title", titleKey:"titleKey"}
 * ```
 * 但是通过同一个key来区分的，不要走这边还是走联合类型
 * ```ts
 * type T = {hidden:true}|{hidden?:false,title:string}
 * //错误
 * const t:T = {title:"title",hidden:true}
 * ```
 */
type XOR<T, U> = (T & { [K in keyof U]?: never }) | (U & { [K in keyof T]?: never })
