import { z } from 'zod'
import { rexMetaSchema } from './common'

export const suburbsResponseSchema = z.object({
  result: z.array(
    z.object({
      0: z.string().nullable(),
      1: z.string(),
      2: z.string(),
      3: z.string(),
      locality: z.null(),
      suburb_or_town: z.string(),
      state_or_region: z.string(),
      postcode: z.string(),
    })
  ),
  error: z.null(),
})

export type SuburbsResponse = z.infer<typeof suburbsResponseSchema>
