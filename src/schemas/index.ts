import { z } from 'zod'

import { authResponseSchema } from './auth'
import { errorResponseSchema } from './error'
import { suburbsResponseSchema } from './suburbs'
import { listingResponseSchema } from './listing'
import { listingsResponseSchema } from './listings'
import { rexMetaSchema } from './common'

// export const queryResponseSchema = listingResponseSchema
//   .or(listingsResponseSchema)
//   .or(suburbsResponseSchema)
//   .or(errorResponseSchema)
//   .or(authResponseSchema)

// export const responseSchema = z.intersection(
//   rexMetaSchema,
//   z
//     .union([
//       authResponseSchema,
//       listingResponseSchema,
//       listingsResponseSchema,
//       suburbsResponseSchema,
//     ])
//     .or(errorResponseSchema)
// )

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
