/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { interpret } from 'xstate'
import { waitFor } from 'xstate/lib/waitFor'
import { queryConfigs } from './lib/config'
import { validatePayload } from './lib/helpers'
import type { QueryType, QueryEvent } from './lib/types'

import { rexMachine } from './rex.machine'
import { authResponseSchema } from './schemas'

declare global {
  const REX_BASE_URL: string
  const REX_USERNAME: string
  const REX_PASSWORD: string
  const REX_KV: KVNamespace
  const REX_AUTH_TOKEN_KEY: string
}

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  REX_KV: KVNamespace
}

/**
 * Replace url with the host you wish to send requests to
 * @param {string} url the URL to send the request to
 */
const url = REX_BASE_URL + '/v1/rex/Authentication/login'

/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response: Response) {
  const { headers } = response
  const contentType = headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json())
  }
  return response.text()
}

async function handleRequest(query: QueryType, payload: string) {
  const init: ResponseInit = {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  }

  const rexService = interpret(
    rexMachine.withConfig({
      services: {
        'Request auth token': async ({ config }) => {
          console.log('CONFIG:', JSON.stringify(config, null, 2))
          if (!config) {
            throw new Error('No query config')
          }
          const response = await fetch(url, config)
          const json = await response.json()
          console.log('JSON:', JSON.stringify(json, null, 2))

          try {
            console.log(
              'PARSE:',
              JSON.stringify(authResponseSchema.parse(json), null, 2)
            )
          } catch (error) {
            console.log('ERRORZ:', JSON.stringify(error, null, 2))
          }
          return { token: authResponseSchema.parse(json).result }
        },
        'Query API': async ({ endpoint, config }) => {
          if (!query || !endpoint || !config) {
            throw new Error('No query config')
          }
          if (!config) {
            throw new Error("Can't query API without config")
          }
          try {
            const url = `${REX_BASE_URL}${endpoint}`
            const response = await fetch(url, config)
            const json = await response.json()
            console.log(JSON.stringify(json, null, 2))
            const { result, error } =
              queryConfigs[query].responseValidator.parse(json)

            if (error) {
              console.error('ERROR FROM SERVER', error)
              throw new Error(error)
            }
            return result
          } catch (error) {
            console.error('OTHER ERROR', error)
            throw new Error(`Error querying API: ${error}`)
          }
        },
      },
    })
  )
    .onTransition((state, event) => {
      // console.log(JSON.stringify(event, null, 2), state.value)
    })
    .start({ context: { cacheKey: [query, payload].join('/') } })

  const readyState = await waitFor(rexService, (state) =>
    state.matches('Ready')
  )

  if (readyState.context.response) {
    return new Response(JSON.stringify(readyState.context.response), init)
  }

  try {
    rexService.send({
      type: 'Query API',
      query,
      payload: validatePayload(query, payload),
    } as QueryEvent)

    const completeState = await waitFor(
      rexService,
      (state) => !!state.context.error || state.matches('Complete'),
      { timeout: 20_000 }
    )

    if (completeState.context.error) {
      throw new Error('completeState.context.error')
    }

    return new Response(JSON.stringify(completeState.context.response), init)
  } catch (error) {
    return new Response(error as string, {
      ...init,
      status: 500,
    })
  }
}

addEventListener('fetch', (event) => {
  const { pathname } = new URL(event.request.url)
  const [, query, payload] = pathname.split('/')

  if (!query || !Object.keys(queryConfigs).includes(query)) {
    return event.respondWith(
      new Response(`"${query}" is not a valid query type`, {
        status: 500,
      })
    )
  }

  return event.respondWith(handleRequest(query as QueryType, payload))
})
