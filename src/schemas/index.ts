import { z } from 'zod'

import { errorResponseSchema } from './error'
import { suburbsResponseSchema } from './suburbs'
import { listingResponseSchema } from './listing'
import { listingsResponseSchema } from './listings'

export const responseSchema = errorResponseSchema.or(
  z.union([
    listingResponseSchema,
    listingsResponseSchema,
    suburbsResponseSchema,
  ])
)

export type QueryResponse = z.infer<typeof responseSchema>

export * from './auth'
export * from './listing'
export * from './listings'
export * from './suburbs'
