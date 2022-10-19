import { z } from 'zod'
import { queryConfigs } from './config'

export type QueryConfig = typeof queryConfigs

export type QueryType = keyof QueryConfig

export type QueryEvent<T extends string = 'Call API'> = {
  [K in keyof QueryConfig]: {
    type: T
    route: K
  } & (QueryConfig[K] extends infer T
    ? T extends { ['payloadValidator']: z.ZodTypeAny }
      ? { payload: string /* z.infer<T['payloadValidator']> */ }
      : {}
    : never)
}[keyof QueryConfig]

export type QueryContext = {
  [K in keyof QueryConfig]: {
    route: K
    endpoint: QueryConfig[K]['endpoint']
    config: RequestInit
  }
}[keyof QueryConfig]

export type QueryConfigArgs = {
  [K in keyof QueryConfig]: QueryConfig[K] extends {
    payloadValidator: infer T extends z.ZodTypeAny
  }
    ? { token: string; route: K; payload: z.infer<T> }
    : { token: string; route: K }
}[keyof QueryConfig]
