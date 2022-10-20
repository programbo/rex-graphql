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

const graphQLServer = startGraphQLServer()

function startGraphQLServer() {
  return createServer<Env>({
    schema: { typeDefs, resolvers },
    endpoint: '/gql',
  }).start()
}

async function fetchData(route: string, payload: string) {
  if (!Object.keys(queryConfigs).includes(route)) {
    throw new Error(`"${route}" is not a valid query type`)
  }

  const response = await rex(route as QueryType, payload)
  return JSON.stringify(response)
}

async function handleRequest(route: string, payload: string) {
  return new Response(await fetchData(route, payload), jsonHeader)
}

function getRequestParameters(request: Request) {
  const { pathname } = new URL(request.url)
  const [, query, payload] = pathname.split('/')
  const route = query || 'listings'
  return [route, payload]
}

addEventListener('fetch', ({ request, respondWith }) => {
  const [route, payload] = getRequestParameters(request)

  if (route === 'gql') {
    return graphQLServer
  }

  try {
    respondWith(handleRequest(route, payload))
  } catch (err) {
    console.error(JSON.stringify(err, null, 2))
    respondWith(new Response(err as string, { ...jsonHeader, status: 500 }))
  }
})
