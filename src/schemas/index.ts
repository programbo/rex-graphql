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

export const responseSchema = z.intersection(
  rexMetaSchema,
  z.union([
    authResponseSchema,
    listingResponseSchema,
    listingsResponseSchema,
    suburbsResponseSchema,
    errorResponseSchema,
  ])
)

export type QueryResponse = z.infer<typeof responseSchema>
// export const responseSchema = {
//   listing: listingResponseSchema.or(errorResponseSchema),
//   listings: listingsResponseSchema.or(errorResponseSchema),
//   explore: listingsResponseSchema.or(errorResponseSchema),
//   suburbs: suburbsResponseSchema.or(errorResponseSchema),
//   auth: authResponseSchema.or(errorResponseSchema),
// } as const

// export type QueryResponse<T extends keyof typeof responseSchema> = z.infer<
//   typeof responseSchema[T]
// >

export * from './auth'
export * from './listing'
export * from './listings'
export * from './suburbs'
