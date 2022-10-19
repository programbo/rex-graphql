import deepmerge from '@fastify/deepmerge'
import { z } from 'zod'
import { queryConfigs } from './config'
import { QueryType, QueryConfig, QueryConfigArgs, QueryContext } from './types'

const merge = deepmerge()

export const validatePayload = <
  T extends QueryType,
  P extends QueryConfig[T] extends { payloadValidator: z.ZodTypeAny }
    ? QueryConfig[T]['payloadValidator']['_input']
    : unknown
>(
  route: T,
  payload: P
) => {
  const config: QueryConfig[T] = queryConfigs[route]
  if (payload && 'payloadValidator' in config) {
    return config.payloadValidator.parse(payload)
  }
}

export const buildQueryConfig = ({
  route,
  ...args
}: QueryConfigArgs): QueryContext => {
  const queryConfig = queryConfigs[route]
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
    body: JSON.stringify(merge(body || {}, payload || {})),
  }

  return { route, endpoint, config } as QueryContext
}
