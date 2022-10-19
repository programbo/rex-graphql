import { assign, createMachine, sendParent, sendUpdate } from 'xstate'
import { log } from 'xstate/lib/actions'
import { authResponseSchema } from './schemas'
export const rexAuthMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCUwA8AEBBArgFwAsMAVAewGswA7AOgGECwBjcjAM1ICcMmBDJxhAx4K1AMQRSVMDQCWVAG6iaA5uTr9GAbQAMAXUSgADqViy8sqYZBpEAWgAsANgCsNAJzunDgOw+ATAEAzC7+-i4ANCAAnohB3jRBAIxOABw+SUHuIf7u4QC++VGomLiEJKK0DGrsXDyakMKVElIy8kqUKowsGqpaSQZIICZmFlZDtgiOLu40Oqn+Dv6pQf5ZPu4+DlGxCL46NA6rue4uzjqbDi6FxejY+ERklFXdrBzcfKpCIs9iYJycLg0IwAG14eHeAFsumpetp9NYRuZLFRrJM7EkdD4aD4Fk5cT4gqlNkENjtEEd-DQnCkXDplnkkktXDcQCV7uUntR6K9ah8Gt9mv9AZxgWCIVxoaoeg1+oNjKZkeNQJMwkkPGlUklQvSnO4dEkfOSEK4HDjkoSZkEHDoLaz2WVHpUaFgmABHHCyTiNH7cgDKvAUYCav108uGirGqIm9kx1o8+0N4TOesiMQp8RooX8Sdt3hp9rujoqzxd7s93sFpYDQZD4jliMjKLR9jyBxcqR03l8TlWWu26b2uLmSWWpJ8OiORKShdKDxL3NdHq9PudNfkUDrVCa9VULWkckUyk+jC5VDDjdGzZjU3cDnVHa7zP19PCxppsxcIWtjPvPl7s4ck6pZLhWq7VoGG5bjuJ5gH8AJAqC4JQioDRnheQxIlGLZTCsqSHBc8y4qkKZJO+GxzB27gLDaNqpMSgHFmeNCoB6cAWFQm7SAA7lu+5tEenTemxsB4I66EIphTbKjY9gONkNDpNkk7Es4WpGoOE5uAaGQXPRzhJIajHzsxrE4OxUE8XxkgHu0yjCeZoniZUDZSVeMnor4+F3l4WLzEsPguBpuy4k4iQBCk1FEgsBrGZyzpmRZnEYFZvpUPBIpishko0A57HOc8GEKu50YqnJsxOPSpz6ls2r-qk77JIcxIuC4tJZB21xFGyRYmc0qBsN6sBEGlRURiVOHJjQ-gGne+KTg4JFYsaM1Uhchr6laDh-jOrJUKQEBwNYDp9aW1QsHyu6CFul5KqVslTItZpOLkySRdaHZkYO4TqvM6ydtk22GrttxzvFIHliuVb+oGwZpbd2E3hi9JBNSQWnCEqltQ1g7xGaQX4qslUdotqRxcBi6Q5WW40OuyVpTBDQI9eZVTHGbgbHSmQpIEpwDiF+o0EkxKBPMLgvTSXWg0BC60KBUM0wAIq0zMefYGz47kqTeB29EGmmuzY81hlLNr8l3g45Oy2Wy7U-Dbl3ThyMrDipwGskL2c-ziAze2-6Ev4xOpKTVumWAIkcVxYC8fbxWO0jhlhTmaxhM423pDjhtJLMRJBDoOnJDorUgz1YMU7QACiCGcKr93oiE03Ucso551k3PGn4VIm0E8TagsGz+KHlS107hlNZz7s817xqGQ+-tE0Xwf0YUhRAA */
  createMachine(
    {
      context: { token: null, error: null, fromCache: false },
      tsTypes: {} as import('./rexAuth.machine.typegen').Typegen0,
      schema: {
        context: {} as {
          token: string | null
          error: string | null
          fromCache: boolean
        },
        events: { type: 'Refresh token' },
        services: {} as {
          'Check cache for token': { data: string | null }
          'Cache token': { data: void }
          'Request auth token': { data: string | null }
        },
      },
      predictableActionArguments: true,
      on: {
        'Refresh token': {
          target: '.Requesting new token',
          actions: ['Clear token', 'Update parent'],
        },
      },
      id: 'Rex Auth Token',
      initial: 'Check for cached token',
      states: {
        'Check for cached token': {
          invoke: {
            src: 'Check cache for token',
            id: 'checkCache',
            onDone: [
              {
                target: 'Acquired token',
                cond: 'Found token',
                actions: 'Flag from cache',
              },
              {
                target: 'Requesting new token',
              },
            ],
            onError: [
              {
                target: 'Requesting new token',
                cond: 'Credentials defined',
              },
              {
                target: 'Error',
              },
            ],
          },
        },
        'Acquired token': {
          entry: ['Save token', 'Update parent'],
          initial: 'Save token',
          states: {
            'Save token': {
              always: [
                {
                  target: 'Saving token to cache',
                  cond: 'New token',
                },
                {
                  target: 'Done',
                },
              ],
            },
            'Saving token to cache': {
              invoke: {
                src: 'Cache token',
                id: 'cacheToken',
                onDone: [
                  {
                    target: 'Done',
                  },
                ],
                onError: [
                  {
                    target: 'Done',
                    actions: 'Set error caching token',
                  },
                ],
              },
            },
            Done: {
              entry: 'Update parent',
            },
          },
        },
        'Requesting new token': {
          invoke: {
            src: 'Request auth token',
            id: 'requestAuthToken',
            onDone: [
              {
                target: 'Acquired token',
                cond: 'Received token',
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
        Error: {
          entry: ['Update parent', 'Report error'],
        },
      },
    },
    {
      guards: {
        'Found token': (_ctx, { data }) => !!data && typeof data === 'string',
        'Received token': (_ctx, { data }) =>
          !!data && typeof data === 'string',
        'Credentials defined': () => !!REX_USERNAME && !!REX_PASSWORD,
        'New token': ({ fromCache }) => !fromCache,
      },
      actions: {
        'Save token': assign((_ctx, { data }) => ({ token: data })),
        'Clear token': assign((_ctx) => ({ token: null, fromCache: false })),
        'Report error': ({ error }) =>
          sendParent({ type: 'Authentication error', error }),
        'Update parent': sendUpdate(),
        'Set error requesting token': assign((_ctx) => ({
          error: 'An error occured re equesting token',
        })),
        'Set error no token received': assign((_ctx) => ({
          error: 'No token recieved',
        })),
        'Set error caching token': assign((_ctx) => ({
          error: 'An error occured caching the token',
        })),
        'Flag from cache': assign((_ctx) => ({ fromCache: true })),
      },
      services: {
        'Check cache for token': async () => {
          try {
            return await REX_KV.get(REX_AUTH_TOKEN_KEY)
          } catch (err) {
            console.error(err)
            return null
          }
        },
        'Cache token': ({ token }) => {
          if (token) {
            return REX_KV.put(REX_AUTH_TOKEN_KEY, token)
          }
          return Promise.resolve()
        },
        'Request auth token': async (_ctx) => {
          const response = await fetch(`${REX_BASE_URL}${REX_AUTH_PATH}`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
              email: REX_USERNAME,
              password: REX_PASSWORD,
              token_lifetime: '604800',
            }),
          })
          const json = await response.json()
          const { result, error } = authResponseSchema.parse(json)

          if (error) {
            throw new Error(error)
          }
          return result
        },
      },
    }
  )
