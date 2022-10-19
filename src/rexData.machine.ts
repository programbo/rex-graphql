import { createMachine, spawn, ActorRefFrom, assign, send } from 'xstate'
import { sendTo } from 'xstate/lib/actions'
import { queryConfigs } from './lib/config'
import { buildQueryConfig, validatePayload } from './lib/helpers'
import { QueryConfigArgs, QueryEvent, QueryType } from './lib/types'
import { rexAuthMachine } from './rexAuth.machine'
import { QueryResponse } from './schemas'
import { errorResponseSchema } from './schemas/error'

type RexDataEvents =
  | QueryEvent<'Call API'>
  | { type: 'Auth token received' }
  | { type: 'Cache hit'; data: QueryResponse['result']; stale?: boolean }
  | { type: 'Skip cache' }
  | { type: 'Renew expired token' }
  | { type: 'Handle response'; data: QueryResponse['result']; stale: false }
  | { type: 'Handle error'; error: QueryResponse['error'] }
  | { type: 'error.platform.queryAPI'; error: QueryResponse['error'] }

type RexDataContext = {
  tokenRef: ActorRefFrom<typeof rexAuthMachine> | null
  route: QueryType | null
  payload: unknown
  requestConfig: RequestInit
  response: QueryResponse['result']
  error: string | null
  tokenRefreshed: number
  shouldCacheResponse: boolean
  shouldUpdateCachedResponse: boolean
  cacheTTL: number
  cacheKey: string
}

type RexDataServices = {
  // 'Check cache for response': () => Promise<QueryResponse['result'] | null>
  'Query API': {
    data: QueryResponse['result']
  }
  // 'Cache response': () => Promise<void>
}

export const rexDataMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCUwA8AEARAhgFxwDoBJCAGzAGIBhHMsjAQQAViBtABgF1FQAHAPawAlnmECAdrxBpEAWgAcAJiWEAjABYFAdg1rtAZgUaAbAE4ANCACeiNWo6EOS7WpcntAVgOfXCgL7+VqiYuAQk5FS09EysbGo8SCCCImKS0rIIihoahJ4artpmSkamljaIKo4mGp4cCgpqHgpGuoHB6Nj4RKQUNHQMLOxKifxCouJSSZly+aoGBTpKygb1Sp5WtggtTi5u2h7evmoBQSAhXeHUABZgAMYA1sISUBh3OHe3GABmAgBOGD+cEEElgUQ+X2uok4o2S4zSU1AMyUGlUnjM3iaZg4NXy2m0m0q2LyHC8zQ0HA4Zg0Zna506YSIN3uTxebwhYB+-0BwMkYP6n05ULw8VhKQm6Wm8hKqkpZgMZm0ygaZjcSkJCAVakIhhMJhx3hUhjUBjpF0ZhGZj2er3egq5AKBsBB-IAyk8+OzBTDpOKERlEPLCAZNAsCsV7DiTBrVgZCGZ5Sa3PV9QpPGaGd1CKgAI4AVzgeAwEG6lAAEjgJJEMGA-n9-j6kn7JgGEKZgy0E+ZtC4OAZ8RqHMUnK4ODkOJ4lJptBnQlncwXYEWSwRy5Xq06XWBG2NUi2pVlPG4dSaDCYSujtKTB33ckVPB4E-3PDoZ2dzfOwPnC8XS6gJGAADuNZoHwwhAhAGB4AIDxgBIO5wnukpIvI+jaiY9h1AY-ZpjUGg3vYTg0nUR4cCaCbpu+mbhKgdxgMIABukA8s6fJgIQro4ExLFbpQCHNshMjyJ2hAXmOIYeDUBjqhUCD5HG5jUkoNTFGYJhGLOlxELR9FMZBm5sRxXGcgZoJUKKvrwvuKGHq4hAKCYChUj4ymOf2GqYsGJgvmUVKRiYmkWjpjHMaZYKWhyPFsZQECSOxzwMTB7F2rcqCsWZ-FWYJMz6iYeTSWoL5KupbgbLJjmyusaaKsYY7OIFn50SF+m8mZEX2mFVC1vWfyEHwZD4L8fwALaEClYBpVumVIYiQlZD2Cj2coBT6KR8rRrJByOCaOI+CGqwlG+HRzjR9y6aFrX8tNEqzci6w6uiFJXk5OTLAoGoFJ4wb6D4NKKlqppUSdTK3NabJDVBSUSJaoOslAfHcJZM2tnI6y5BS3iuOexT5OUWyNNqRjKFVughgotJA1pMMsjaDqQ7B0NWnDfEJEjN0oxhokqn2aa1ZOBKbQ06imKSCqrLo6wNVcsO0xD0EM4QADqOATC8lCMHmeDXPTcE8k1enXf6B5yPieT4qq6ljnUDQyVsWM6ueapnrU+QBZTFpM7L3Ly3BSsq2IatoEu+DsTg3x4LWAAUdQcAAlJQH7SzT4Pe1Dfuq1AhvWXNWjxv2ujyioxj5MYGrk19HimC+5P1GpShSyDyevHLafKxnlBBwQEeEGHEd-NHlLx4njdg83qcK23AeZ6zTZZbdlRjoQ3lKgUFIYasfZl-UHbLesV5Tn2DfU6PdM+xIMVxYQwfd8Px9w6fUNZ9l0pqeo9jnhOGhag4+GyQ4Cw6gxI+eUXgdCUTOBIAQEA4DSFvr0MAbMjY2TkDVHUyhK7PmUHjOw2FRLmGwuJPQpgURH09mycadNOqIOzsidE8YzDKG8I5RyngHw3jMHgxMR4vA+CxkfBcP4Vw4Goc-LIShqSiW8BOMcRRnrvT-oVdGip9S6CKGAwGx0qYAFE6z-BEfPBAKJtCiTItXBhTDijyK2EOQmJopw1CnKYI69JgbZjOs1KKbVOLcSobPZGxtGhfRcHoQqJd+xng+nqdQrlCrk0jMYfh7i9KePCrQDql0EF+PZsbJUHCQxTiVNXI8G18Z0KpKwtS5NcmNESfrC66VwpYDivolGFSTwnBpLoWoU4ypbH1EElwuFBkom8rU86LUGmZN3Nk5BDRjFiS-k0A4X9baIGkhwtwepYmqgcAk92WYyFjwBGfO+NoWnGxUHlFQak3CKkVPUFoGp7YHCnCoZ2rDTCkJlinY5adUA4AgFsaZSC5qo2kk4WMRQxx-VjGXDE6hVH6HWBiZYbtNEe2+UcnW0NJ5nKySCzIO0OyrWMEs6kHgnlNAdkoeoa8ewqHrvspOJ8W4M3Ocgg6hAMb9iaOItG2CEDnmMS82lOJ6UqAbuy0FDhlJoOUqTUB4iNSzDjIqZYPZpKmFRMoQIgQgA */
  createMachine(
    {
      context: {
        tokenRef: null,
        response: null,
        error: null,
        tokenRefreshed: 0,
        shouldCacheResponse: false,
        shouldUpdateCachedResponse: false,
        requestConfig: {
          method: 'POST',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
            Authentication: '',
          },
        },
        route: null,
        payload: '',
        cacheTTL: 0,
        cacheKey: '',
      },
      tsTypes: {} as import('./rexData.machine.typegen').Typegen0,
      schema: {
        context: {} as RexDataContext,
        events: {} as RexDataEvents,
        services: {} as RexDataServices,
      },
      predictableActionArguments: true,
      entry: 'Prepare auth token',
      id: 'Rex Data',
      initial: 'Idle',
      states: {
        Idle: {
          on: {
            'Call API': [
              {
                cond: 'Invalid route',
                actions: 'Set invalid route error',
              },
              {
                cond: 'Invalid payload',
                actions: 'Set invalid payload error',
              },
              {
                target: 'Checking cache for response',
                actions: 'Set query params',
                description: '* route\n* payload []',
              },
            ],
          },
        },
        'Checking cache for response': {
          invoke: {
            src: 'Check cache for response',
            id: 'checkCache',
          },
          on: {
            'Cache hit': [
              {
                target: 'Received response',
                cond: 'Cache is stale',
                actions: 'Flag for refresh',
              },
              {
                target: 'Received response',
              },
            ],
            'Skip cache': {
              target: 'Checking for token',
              actions: 'Flag for caching',
            },
          },
        },
        'Request data': {
          invoke: {
            src: 'Query API',
            id: 'queryAPI',
          },
          on: {
            'Handle error': {
              target: 'Error',
              actions: 'Set API error',
            },
            'Handle response': {
              target: 'Received response',
            },
            'Renew expired token': {
              target: 'Checking for token',
              actions: ['Refresh token', 'Flag token as refreshed'],
            },
          },
        },
        Error: {
          entry: 'Log error message',
        },
        'Received response': {
          entry: 'Save result',
          initial: 'Save response',
          states: {
            'Save response': {
              always: [
                {
                  target: 'Cache response',
                  cond: 'Flagged for caching',
                },
                {
                  target: 'Done',
                },
              ],
            },
            'Cache response': {
              invoke: {
                src: 'Cache response',
                id: 'cacheResponse',
                onDone: [
                  {
                    target: 'Done',
                  },
                ],
                onError: [
                  {
                    target: 'Done',
                  },
                ],
              },
            },
            Done: {
              type: 'final',
            },
          },
          always: {
            target: 'Checking for token',
            cond: 'Flagged for refresh',
            actions: ['Flag for caching', 'Remove flag for refresh'],
          },
        },
        'Checking for token': {
          initial: 'Waiting',
          states: {
            Checking: {
              always: [
                {
                  target: 'Ready',
                  cond: 'Has auth token',
                },
                {
                  target: 'Waiting',
                  actions: 'Request token',
                },
              ],
            },
            Ready: {
              type: 'final',
            },
            Waiting: {
              after: {
                '500': [
                  {
                    target: '#Rex Data.Checking for token.Ready',
                    cond: 'Has auth token',
                    actions: [],
                    internal: false,
                  },
                  {
                    target: '#Rex Data.Checking for token.Waiting',
                    actions: [],
                    internal: false,
                  },
                ],
              },
              on: {
                'Auth token received': {
                  target: 'Checking',
                },
              },
            },
          },
          onDone: {
            target: 'Request data',
          },
        },
      },
    },
    {
      guards: {
        'Invalid route': ({ route }) => !!route && route in queryConfigs,
        'Invalid payload': ({ route, payload }) => {
          try {
            return !!route && !validatePayload(route, payload)
          } catch (error) {
            return true
          }
        },
        'Cache is stale': () => false,
        'Flagged for refresh': ({ shouldUpdateCachedResponse }) =>
          shouldUpdateCachedResponse,
        'Flagged for caching': ({ shouldCacheResponse }) => shouldCacheResponse,
        'Has auth token': ({ tokenRef }) =>
          !!tokenRef?.getSnapshot()?.context.token,
      },
      actions: {
        'Prepare auth token': assign((_ctx) => ({
          tokenRef: spawn(rexAuthMachine, { name: 'rexAuth' }),
        })),
        'Flag for caching': assign((_ctx) => ({ shouldCacheResponse: true })),
        'Flag for refresh': assign((_ctx) => ({
          shouldUpdateCachedResponse: true,
        })),
        'Refresh token': sendTo('rexAuth', 'Refresh token'),
        'Flag token as refreshed': assign(({ tokenRefreshed }) => ({
          tokenRefreshed: tokenRefreshed + 1,
        })),
        'Remove flag for refresh': assign((_ctx) => ({
          shouldUpdateCachedResponse: false,
        })),
        'Save result': assign((_ctx, { data }) => ({ response: data })),
        'Set API error': assign((_ctx, { error }) => ({
          error: error?.message,
        })),
        'Set invalid payload error': assign((_ctx) => ({
          error: 'Invalid payload',
        })),
        'Set invalid route error': assign((_ctx) => ({
          error: 'Invalid route',
        })),
        'Set query params': assign((_ctx, { type, ...evt }) => ({
          ...evt,
          cacheKey: [evt.route, 'payload' in evt ? evt.payload : '']
            .filter(Boolean)
            .join('/')
            .toLowerCase(),
        })),
        'Request token': send({ type: 'Refresh token' }, { to: 'rexAuth' }),
        'Log error message': ({ error }) =>
          console.error('REX DATA ERROR STATE', error),
      },
      services: {
        'Check cache for response':
          ({ cacheKey, cacheTTL }) =>
          (send) => {
            REX_KV.getWithMetadata<{ created: number }>(cacheKey)
              .then(({ value, metadata }) => {
                if (value) {
                  send({
                    type: 'Cache hit',
                    data: JSON.parse(value),
                    stale:
                      !!metadata && metadata.created + cacheTTL > Date.now(),
                  })
                } else {
                  send({ type: 'Skip cache' })
                }
              })
              .catch(() => {
                send({ type: 'Skip cache' })
              })
          },
        'Cache response': ({ cacheKey, response }) =>
          response
            ? REX_KV.put(cacheKey, JSON.stringify(response), {
                metadata: {
                  created: Date.now(),
                },
              })
            : Promise.reject(),
        'Query API':
          ({ route, tokenRef, payload }) =>
          (send) => {
            try {
              if (!route) {
                throw new Error('Invalid route')
              }
              const token = tokenRef?.getSnapshot()?.context.token
              if (!token) {
                throw new Error('No auth token')
              }
              const { endpoint, config } = buildQueryConfig({
                route,
                token,
                payload: validatePayload(route, payload),
              } as QueryConfigArgs)

              fetch(`${REX_BASE_URL}${endpoint}`, config)
                .then((res) => res.json())
                .then((data) => {
                  try {
                    const { result, error } = queryConfigs[
                      route
                    ].responseValidator
                      .or(errorResponseSchema)
                      .parse(data)

                    if (error) {
                      if (error.type === 'TokenException') {
                        console.error(
                          error.type,
                          JSON.stringify(
                            tokenRef.getSnapshot()?.context,
                            null,
                            2
                          )
                        )
                        return send({ type: 'Renew expired token' })
                      }
                      return send({ type: 'Handle error', error })
                    }
                    return send({
                      type: 'Handle response',
                      data: result,
                      stale: false,
                    })
                  } catch (err) {
                    console.error(
                      'RESPONSE ERROR',
                      `${JSON.stringify(err, null, 2)}`
                    )
                  }
                })
            } catch (err) {
              throw new Error(`${JSON.stringify(err, null, 2)}`)
            }
          },
      },
    }
  )
