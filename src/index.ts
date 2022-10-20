/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { createServer } from '@graphql-yoga/common'
import { resolvers } from './graphql/resolvers'
import { typeDefs } from './graphql/schemas'
import { queryConfigs } from './lib/config'
import { rex } from './lib/rex'
import type { QueryType } from './lib/types'

declare global {
  const REX_BASE_URL: string
  const REX_AUTH_PATH: string
  const REX_USERNAME: string
  const REX_PASSWORD: string
  const REX_KV: KVNamespace
  const REX_AUTH_TOKEN_KEY: string
}

export interface Env {
  REX_KV: KVNamespace
}

const jsonHeader: ResponseInit = {
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  },
}

async function fetchData(route: QueryType, payload: string) {
  try {
    const response = await rex(route, payload)

    return new Response(JSON.stringify(response), jsonHeader)
  } catch (err) {
    console.error(JSON.stringify(err, null, 2))
    return new Response(err as string, {
      ...jsonHeader,
      status: 500,
    })
  }
}

function handlePostRequest() {
  const server = createServer<Env>({
    schema: {
      typeDefs,
      resolvers,
    },
    endpoint: '/gql',
  })

  return server.start()
}

addEventListener('fetch', (event) => {
  const { pathname } = new URL(event.request.url)
  const [, query, payload] = pathname.split('/')
  const route = query || 'listings'

  if (route === 'gql') {
    return handlePostRequest()
  }

  if (!Object.keys(queryConfigs).includes(route)) {
    return event.respondWith(
      new Response(`"${route}" is not a valid query type`, {
        status: 500,
      })
    )
  }

  return event.respondWith(fetchData(route as QueryType, payload))
})
