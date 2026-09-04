/* eslint-disable @typescript-eslint/no-explicit-any */
// Ported verbatim from the original Hono service (loose generic types).
interface Obj {
  [key: string]: any
}

export interface IUseCase<T extends Obj | string = any, TRes = any> {
  execute: (params: T) => Promise<TRes>
}
