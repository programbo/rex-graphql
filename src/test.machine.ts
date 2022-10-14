import deepmerge from '@fastify/deepmerge'
import { assign, createMachine } from 'xstate'
import { z } from 'zod'
import {
  authResponseSchema,
  listingResponseSchema,
  listingsResponseSchema,
  QueryResponse,
  suburbsResponseSchema,
} from './schemas'
import { errorResponseSchema } from './schemas/error'

const merge = deepmerge()

const nameOfMachine = createMachine({
  id: 'nameOf',
  tsTypes: {} as import('./test.machine.typegen').Typegen0,
  schema: {
    context: {} as { contextType },
    events: {} as { type: 'eventType' },
  },
  context: {
    initialContextValue,
  },
  initial: 'initialState',
  states: {
    initialState: {},
  },
})
