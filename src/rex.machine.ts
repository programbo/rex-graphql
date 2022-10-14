import { createMachine, assign } from 'xstate'
import { queryConfigs } from './lib/config'
import { buildQueryConfig } from './lib/helpers'
import { QueryEvent, QueryType } from './lib/types'
import { QueryResponse } from './schemas'

type Events =
  | QueryEvent
  | { type: 'Clear token' }
  | { type: 'Backup query config' }
  | { type: 'Set error validating response' }
  | { type: 'Clear refresh flag' }

export type Context = {
  token: string | null
  query: QueryType | null
  endpoint: string | null
  config: RequestInit | null
  response: QueryResponse['result'] | null
  error: string | null
  tokenRefreshed: boolean
  backup: Pick<Context, 'query' | 'endpoint' | 'config'> | null
  shouldRefreshCachedResponse: boolean
  shouldCacheResponse: boolean
  cacheTTL: number
  cacheKey: string | null
}

type Services = {
  'Read auth token': {
    data: {
      token: string | null
    }
  }
  'Request auth token': {
    data: {
      token: string
    }
  }
  'Save auth token': {
    data: {
      token: string
    }
  }
  'Query API': {
    data: QueryResponse['result']
  }
  'Check cache': {
    data: {
      response: QueryResponse['result'] | null
    }
  }
}

export const rexMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCUwA8B0BFArmATgJ4CWAdlAAQCCACgJIDEEA9qWBmQG7MDW7AjniK06iUAAdmsYgBdirMSDSIAjCoAcKjAAYALADZ1Adl0BWAMyGATOoA0IQqv1GrGXQE5Pp596u7zKgC+gfaomLgEJOTU9AwE+Mz4GOIANgCGMgBmiQC2GIKRIoqS0nIKSEqqGlp6hiYW1nYOqqZW7m6eXuamBgbBoegYAMLMOalgMmAMxVKy8qSKyggq5ro65u7a6hs22kYqVvaOCFb6KvoYKp1GAXrulv0gYRiomfhwABZklGk4Mh8UGS8MCkF5gAqwOTRX7-QHA0hMVjsLjAjDvCEyKh-D4AFXhM1K80WiCsW1MGB6ATU3l6uiMR1U5i2GHMRl8Zl0e106lMj2er3esC+0OxcL4oNQGO+FBhAKB4ri+ASSVSGWy+Dy6LwkKx-zx4oJc3KoCWpJ5FP8ahUNP0ujpDOWVidLLZpm27iMmiM+n0fMGAs+0tlYpBGAAymlOEHRfKQYi2BxSNw+GDMAGhdHYbHQRGoyKs-CECiAMYZeYAbW0AF1DWUFhVTWzXOY-KZTJ6jEZNuYHZ5zBgjFs+909FZWn602A3oH83L4eHI5m5wr4olkuksrlU2DpxnZyGc4v99mi0nmKW65WaxUSkb6yaSU2Wa328Yu9oe81lnt2oP1O59FZfRtAsdQrAnHdBWFH4Y3heN2EhDJ2H5KcoKXA9ayJBtGQCCl7kA7QnWtTtTAdFQQLWPxPBsN0bncGwIIAGWYXgKHVChS2LD5IAPeDE2Tdh3jSCBdVxfEb1mOtiWWaodAMYwzEsMCmmOakWXMDT-ysEdTBA3lHlIZgIDgRQUOE44JEkrCHxObYMHcNsbkIqxPRUEiyPOckdmMQC1G0dxuQgiIiGlIoJMJY1KgQHk1g2Bz1AMM55NIr81A0jAnX0J1tBWH1tl0CCRjGFIJjATDIqWABaA5XG8ZxMu07kWzIzltAwdRjHUH0HI0MDfRCJ5-VQmcYILcUwSlY9xMsiL7yi842QtNpvG6YwQMOVKx3aLLvGMFYDncHkIPTaCZVg8bc3Q7Nyrm00zHUNxCI8QwLDpFyyI-LRjBW7ZOx5LrjuGvdRuXUNc0gG7pLafY3GqfY2XhkCPvIgch12zZuTpQHd1O4NswwABRJVEkh7CTg9LRdDhtz2zcpHNo2F02zA0wAoMVnsbQqaDXCu9pPOFylocwDaPWh1PVcP8PX8p1zG2cwmJYng2MSDi0i4njrt5qSyc7bbOWcbkuttboyMZjTNIS9RCM8IIBueOgkzSFJiAgCgCiIUmbL1jBbW0Q2Op9fwUtUtpKNOMc7X8-RWfUCCieVL2otMFZ2rZEDyL1gIHSsDQ1l07QP3cFZ7j0wruOLHhpU47ik9NbSB1OHp4ZjlwNDIm4dELvRzhA-8HIggB1fBZDAChBUkUhYDHoE1Y1uvEBT-tvozvYu2zr8x3NQdC6dN6ApWCcF4QarBwpH0XAj1Ztg245BYt1kHNWDTgIA4JgiAA */
  createMachine(
    {
      context: {
        token: null,
        query: null,
        endpoint: null,
        config: null,
        response: null,
        error: null,
        tokenRefreshed: false,
        backup: null,
        shouldRefreshCachedResponse: false,
        shouldCacheResponse: false,
        cacheTTL: 1000 * 60 * 60 * 24, // 24 hours
        cacheKey: null,
      },
      tsTypes: {} as import('../rex.machine.typegen').Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Events,
        services: {} as Services,
      },
      predictableActionArguments: true,
      id: 'Rex',
      initial: 'Checking cache',
      states: {
        Ready: {
          on: {
            'Query API': [
              {
                target: 'Querying API',
                cond: 'Query is valid',
                actions: 'Set query config',
                description: '- listings\n- explore\n- listing\n- suburbs',
              },
              {
                target: 'Invalid query',
                actions: 'Set invalid query error',
              },
            ],
          },
        },
        'Querying API': {
          invoke: {
            src: 'Query API',
            id: 'queryAPI',
            onDone: [
              {
                target: 'Complete',
              },
            ],
            onError: [
              {
                target: 'Error',
                cond: 'Invalid response',
                actions: 'Set error validating response',
              },
              {
                target: 'Refreshing auth token',
                cond: 'First invalid token error',
              },
              {
                target: 'Error',
                cond: 'Second invalid token error',
                actions: 'Set received invalid token error',
              },
              {
                target: 'Error',
                actions: 'Set API error',
              },
            ],
          },
        },
        Complete: {
          entry: 'Save response',
          type: 'final',
          always: [
            {
              target: 'Look for cached token',
              cond: 'Flagged for refresh',
              actions: ['Clear refresh flag', 'Flag for caching'],
            },
            {
              target: 'Write response to cache',
              cond: 'Flagged for caching',
            },
          ],
        },
        'Refreshing auth token': {
          entry: [
            'Clear token',
            'Backup query config',
            'Set auth query config',
          ],
          initial: 'Requesting auth token',
          states: {
            'Requesting auth token': {
              invoke: {
                src: 'Request auth token',
                id: 'requestAuthToken',
                onDone: [
                  {
                    target: 'Saving auth token',
                    cond: 'Received token',
                    actions: 'Set auth token',
                    description: 'Store the token in the local context',
                  },
                  {
                    target: 'Error',
                    actions: 'Set error no token received',
                  },
                ],
                onError: [
                  {
                    target: 'Error',
                    actions: 'Set error requesting token',
                  },
                ],
              },
            },
            'Saving auth token': {
              description: 'Write the token back to the REX_KV store',
              invoke: {
                src: 'Save auth token',
                onDone: [
                  {
                    target: 'Saved',
                    actions: 'Set token refreshed flag',
                  },
                ],
                onError: [
                  {
                    target: 'Error',
                    actions: 'Set error saving token',
                  },
                ],
              },
            },
            Saved: {
              type: 'final',
            },
            Error: {
              type: 'final',
            },
          },
          onDone: [
            {
              target: 'Error',
              cond: 'Errors have occured',
            },
            {
              target: 'Querying API',
              actions: 'Restore query config',
            },
          ],
        },
        'Look for cached token': {
          description: 'Read the current auth token from the REX_KV store',
          invoke: {
            src: 'Read auth token',
            id: 'readAuthToken',
            onDone: [
              {
                target: 'Ready',
                cond: 'Token found',
                actions: 'Set auth token',
              },
              {
                target: 'Refreshing auth token',
              },
            ],
          },
        },
        'Invalid query': {
          type: 'final',
        },
        Error: {
          type: 'final',
        },
        'Checking cache': {
          invoke: {
            src: 'Check cache',
          },
          on: {
            'Flag cache for refresh': {
              actions: 'Flag for refresh',
            },
            'Cache miss': {
              target: 'Look for cached token',
              actions: 'Flag for caching',
            },
            'Cache hit': {
              target: 'Complete',
            },
          },
        },
        'Write response to cache': {
          invoke: {
            src: 'Cache response',
          },
          type: 'final',
        },
      },
    },
    {
      guards: {
        'Query is valid': (_ctx, { query }) => query in queryConfigs,
        'First invalid token error': ({ tokenRefreshed }, evt) =>
          !tokenRefreshed,
        'Second invalid token error': ({ tokenRefreshed }) => tokenRefreshed,
        'Token found': (_ctx, { data }) => !!data.token,
        'Invalid response': (_ctx, { data }) => !data.result,
        'Flagged for refresh': (_ctx, { shouldRefreshCachedResponse }) =>
          !!shouldRefreshCachedResponse,
        'Flagged for caching': (_ctx, { shouldCacheResponse }) =>
          !!shouldCacheResponse,
        'Errors have occured': (_ctx, _evt) => ({}),
        'Received token': (_ctx, { data }) => !!data.token,
      },
      actions: {
        'Set query config': assign(({ token }, { type: _, ...evt }) =>
          evt.query === 'auth'
            ? buildQueryConfig(evt)
            : buildQueryConfig({ token, ...evt })
        ),
        'Set auth query config': assign((_ctx, _evt) =>
          buildQueryConfig({ query: 'auth' })
        ),
        'Clear token': assign((_ctx, _evt) => ({ token: null })),
        'Set auth token': assign((_ctx, { data: { token } }) => ({ token })),
        'Set invalid query error': assign((_ctx, { query }) => ({
          error: `"${query}" is not a valid query type!`,
        })),
        'Set received invalid token error': assign((_ctx, _evt) => ({
          error: 'Received invalid token',
        })),
        'Set API error': assign((_ctx, _evt) => ({
          error: 'An error occured querying the API',
        })),
        'Set error requesting token': assign((_ctx, _evt) => ({
          error: 'An error occured requesting a new token',
        })),
        'Set error saving token': assign((_ctx, _evt) => ({
          error: 'An error occured saving the new token',
        })),
        'Set token refreshed flag': assign((_ctx, _evt) => ({
          tokenRefreshed: true,
        })),
        'Backup query config': assign(({ query, endpoint, config }, _evt) => ({
          backup: { query, endpoint, config },
        })),
        'Restore query config': assign(({ backup }, _evt) => ({
          ...backup,
        })),
        'Set error validating response': assign((_ctx, _evt) => ({
          error: 'An error occured validating the response',
        })),
        'Set error no token received': assign((_ctx, _evt) => ({
          error: 'No token received',
        })),
        'Save response': assign((_ctx, { data }) => ({ response: data })),
        'Clear refresh flag': assign((_ctx, _evt) => ({
          shouldRefreshCachedResponse: null,
        })),
        'Flag for caching': assign((_ctx, _evt) => ({
          shouldCacheResponse: true,
        })),
        'Flag for refresh': assign((_ctx, _evt) => ({
          shouldRefreshCachedResponse: true,
        })),
      },
      services: {
        'Read auth token': async (_ctx, _evt) => ({
          token: await REX_KV.get(REX_AUTH_TOKEN_KEY),
        }),
        'Save auth token': async (_ctx, { data: { token } }) => {
          await REX_KV.put(REX_AUTH_TOKEN_KEY, token)
          return { token }
        },
        'Check cache':
          ({ cacheTTL, cacheKey }, { query }) =>
          (send) => {
            if (!cacheKey) {
              send({ type: 'Cache miss' })
              return
            }

            REX_KV.getWithMetadata<{
              created: number
            }>(cacheKey).then(({ value, metadata }) => {
              if (!value) {
                send({ type: 'Cache miss' })
              } else if (metadata && metadata.created + cacheTTL > Date.now()) {
                send({ type: 'Flag cached response for refresh' })
              } else {
                send({ type: 'Cache hit', data: JSON.parse(value) })
              }
            })
            return
          },
        'Cache response': async ({ cacheKey }, { data }) => {
          if (!cacheKey) return
          await REX_KV.put(cacheKey, JSON.stringify(data), {
            metadata: { created: Date.now() },
          })
        },
      },
    }
  )
