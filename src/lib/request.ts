import { errorResponseSchema } from '../schemas/error'
import { queryConfigs } from './config'
import { buildQueryConfig, validatePayload } from './helpers'
import { QueryConfigArgs, QueryType } from './types'

interface RequestProps {
  route: QueryType
  token: string
  payload: unknown
}

export const request = async ({ route, token, payload }: RequestProps) => {
  const { endpoint, config } = buildQueryConfig({
    route,
    token,
    payload: validatePayload(route, payload),
  } as QueryConfigArgs)

  const response = await fetch(`${REX_BASE_URL}${endpoint}`, config)
  const json = await response.json()

  return queryConfigs[route].responseValidator
    .or(errorResponseSchema)
    .parse(json)
}
