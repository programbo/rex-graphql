import { z } from 'zod'

export const authResponseSchema = z.object({
  error: z.null(),
  result: z.string(),
})

export type AuthResponse = z.infer<typeof authResponseSchema>
