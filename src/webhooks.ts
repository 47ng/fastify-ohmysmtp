import type { FastifyInstance, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

const dateLike = z
  .union([z.number().positive().int(), z.date()])
  .refine(value => Number.isSafeInteger(new Date(value).valueOf()), {
    message: 'Invalid date input'
  })
  .transform(value => new Date(value))

export const webhookBody = z.object({
  event: z.enum([
    'email.queued',
    'email.delivered',
    'email.deferred',
    'email.bounced',
    'email.spam'
  ] as const),
  payload: z.object({
    status: z.enum([
      'queued',
      'delivered',
      'deferred',
      'bounced',
      'spam'
    ] as const),
    id: z.number(),
    domain_id: z.number(),
    created_at: dateLike,
    updated_at: dateLike,
    from: z.string().email(),
    to: z.string().nullable(),
    htmlbody: z.string().nullable(),
    textbody: z.string().nullable(),
    cc: z.string().nullable(),
    bcc: z.string().nullable(),
    subject: z.string().nullable(),
    replyto: z.string().email().nullable(),
    message_id: z.string(),
    list_unsubscribe: z.string().nullable()
  })
})

export type WebhookJSONBody = z.input<typeof webhookBody>
export type WebhookBody = z.output<typeof webhookBody>
export const webhookBodySchema = zodToJsonSchema(webhookBody)

export type WebhookHandlersMap = Partial<{
  [Event in WebhookBody['event']]: (
    payload: WebhookBody['payload'],
    request: FastifyRequest,
    fastify: FastifyInstance
  ) => Promise<void>
}>
