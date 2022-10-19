import { z } from 'zod'

export const suburbsResponseSchema = z.object({
  error: z.null(),
  result: z.array(
    z.object({
      locality: z.null(),
      suburb_or_town: z.string(),
      state_or_region: z.string(),
      postcode: z.string(),
    })
  ),
})

export type SuburbsResponse = z.infer<typeof suburbsResponseSchema>
