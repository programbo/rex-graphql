import { interpret } from 'xstate'
import { waitFor } from 'xstate/lib/waitFor'
import { rexDataMachine } from '../rexData.machine'
import { queryConfigs } from './config'
import { QueryType } from './types'

export async function rex<T extends { result: any }>(
  route: QueryType,
  payload: string = ''
): Promise<T['result']> {
  // Abort early if the route is not supported
  if (!Object.keys(queryConfigs).includes(route)) {
    throw new Error(`"${route}" is not a valid query type`)
  }

  // Start the REX data service
  const rexService = interpret(rexDataMachine).start()

  // Tell the service what data to fetch
  rexService.send({ type: 'Call API', route, payload })

  // Wait for the service has data or an error (max 20 seconds)
  const {
    context: { response, error },
  } = await waitFor(
    rexService,
    ({ context: { response, error } }) => !!error || !!response,
    { timeout: 20_000 }
  )

  // Throw an error if the service has one
  if (error) {
    throw new Error(error)
  }

  return response
}
