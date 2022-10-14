import deepmerge from '@fastify/deepmerge'
import { z } from 'zod'
import { Context } from '../rex.machine'
import { queryConfigs } from './config'
import { QueryType, QueryConfig, QueryConfigArgs, QueryContext } from './types'

const merge = deepmerge()

export const validatePayload = <
  T extends QueryType,
  P extends QueryConfig[T] extends { payloadValidator: z.ZodTypeAny }
    ? QueryConfig[T]['payloadValidator']['_input']
    : unknown
>(
  query: T,
  payload: P
) => {
  const config: QueryConfig[T] = queryConfigs[query]
  if (payload && 'payloadValidator' in config) {
    try {
      return config.payloadValidator.parse(payload)
    } catch (error) {
      throw new Error(`Payload doesn't match the "${query}" schema.\n${error}`)
    }
  }
  return
}

export const buildQueryConfig = ({
  query,
  ...args
}: QueryConfigArgs<Context>): QueryContext => {
  const queryConfig = queryConfigs[query]
  const endpoint = queryConfig.endpoint
  const body = 'body' in queryConfig ? queryConfig.body : undefined
  const payload = 'payload' in args ? args.payload : undefined

  const bearer =
    'token' in args ? { Authorization: `Bearer ${args.token}` } : undefined

  const headers: HeadersInit = {
    'content-type': 'application/json;charset=UTF-8',
    ...bearer,
  }

  const config: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(merge(body, payload)),
  }

  return { query, endpoint, config } as QueryContext
}
