import { z } from 'zod'
import { queryConfigs } from './config'

export type QueryConfig = typeof queryConfigs

export type QueryType = keyof QueryConfig

export type QueryEvent = {
  [K in keyof QueryConfig]: {
    type: 'Query API'
    query: K
  } & (QueryConfig[K] extends infer T
    ? T extends { ['payloadValidator']: z.ZodTypeAny }
      ? { payload: z.infer<T['payloadValidator']> }
      : {}
    : never)
}[keyof QueryConfig]

export type QueryContext = {
  [K in keyof QueryConfig]: {
    query: K
    endpoint: QueryConfig[K]['endpoint']
    config: RequestInit
  }
}[keyof QueryConfig]

export type QueryConfigArgs<C extends { token: string | null }> = {
  [K in keyof QueryConfig]: QueryConfig[K] extends {
    payloadValidator: infer T extends z.ZodTypeAny
  }
    ? { token: C['token']; query: K; payload: z.infer<T> }
    : QueryConfig[K] extends { requiresToken: true }
    ? { token: C['token']; query: K }
    : { query: K }
}[keyof QueryConfig]
