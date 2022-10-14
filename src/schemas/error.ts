import { z } from 'zod'
import { rexMetaSchema } from './common'

export const errorResponseSchema = rexMetaSchema.extend({
  result: z.null(),
  error: z.object({
    message: z.string(),
    type: z.string(),
    code: z.number(),
    extra: z.object({
      request_data: z.object({
        method: z.string(),
        args: z.array(z.unknown()).or(z.record(z.unknown())),
        token: z.string(),
        sudo_token: z.null(),
        use_status_codes: z.boolean(),
        use_strict_arguments: z.boolean(),
        strip_response_prefixes: z.boolean(),
        add_request_prefixes: z.boolean(),
      }),
    }),
  }),
})

export type RexErrorResponse = z.infer<typeof errorResponseSchema>
