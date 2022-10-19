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
import type { QueryType } from './lib/types'

import { rexDataMachine } from './rexData.machine'

declare global {
  const REX_BASE_URL: string
  const REX_AUTH_PATH: string
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

async function handleRequest(route: QueryType, payload: string) {
  const startTime = Date.now()
  const init: ResponseInit = {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  }

  const rexService = interpret(rexDataMachine)
    .onTransition((state, { type, ...evt }) => {
      console.log(
        '🪵',
        JSON.stringify(type),
        '👉',
        JSON.stringify(state.value),
        // '🔎',
        // '🎁',
        // JSON.stringify(evt, null, 2),
        '🧐\n'
      )
    })
    .start()

  rexService.send({
    type: 'Call API',
    route,
    payload,
  })

  try {
    const { context } = await waitFor(
      rexService,
      (state) => !!state.context.error || !!state.context.response,
      { timeout: 20_000 }
    )

    if (context.error) {
      throw new Error(context.error)
    }

    console.log(Date.now() - startTime + 'ms')

    return new Response(JSON.stringify(context.response), init)
  } catch (err) {
    console.error(
      `💥 In "${JSON.stringify(
        rexService.getSnapshot().context.tokenRef?.getSnapshot()?.value,
        null,
        2
      )}" 💥 -`,
      err
    )
    return new Response(err as string, {
      ...init,
      status: 500,
    })
  }
}

addEventListener('fetch', (event) => {
  const { pathname } = new URL(event.request.url)
  const [, query, payload] = pathname.split('/')

  if (!query) {
    return event.respondWith(
      new Response('Hello world', {
        status: 500,
      })
    )
  } else if (!Object.keys(queryConfigs).includes(query)) {
    return event.respondWith(
      new Response(`"${query}" is not a valid query type`, {
        status: 500,
      })
    )
  }
  event.respondWith(handleRequest(query as QueryType, payload))
  return
})
