import { z } from 'zod'
import { rexMetaSchema } from './common'

export const authResponseSchema = z.object({
  result: z.string(),
  error: z.null(),
})

export type AuthResponse = z.infer<typeof authResponseSchema>
