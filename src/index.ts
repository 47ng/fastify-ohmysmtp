import * as OhMySMTP from '@ohmysmtp/ohmysmtp.js'
import type { FastifyInstance, RouteShorthandOptions } from 'fastify'
import fp from 'fastify-plugin'
import { WebhookBody, webhookBodySchema, WebhookHandlersMap } from './webhooks'

declare module 'fastify' {
  interface FastifyInstance {
    ohmysmtp: OhMySMTP.DomainClient
  }
}

export interface Configuration {
  /**
   * The OhMySMTP API token to use for authentication.
   *
   * If not provided, it will be read from the `OHMYSMTP_API_TOKEN`
   * environment variable.
   */
  apiToken?: string

  /**
   * Enable incoming webhooks for email events by passing
   * an object with a path to register your endpoint to,
   * and a map of handlers for specific event types.
   */
  webhooks?: {
    path: string
    routeConfig?: Omit<RouteShorthandOptions, 'schema'>
    handlers: WebhookHandlersMap
  }
}

async function ohMySMTPPlugin(
  fastify: FastifyInstance,
  config: Configuration = {}
) {
  const apiToken = config.apiToken ?? process.env.OHMYSMTP_API_TOKEN
  if (!apiToken) {
    throw new Error('[fastify-ohmysmtp] Missing API token for OhMySMTP')
  }
  const client = new OhMySMTP.DomainClient(apiToken)
  fastify.decorate('ohmysmtp', client)

  if (config.webhooks) {
    fastify.post<{ Body: WebhookBody }>(
      config.webhooks.path,
      {
        ...(config.webhooks.routeConfig ?? {}),
        schema: {
          body: webhookBodySchema,
          response: {
            200: {
              type: 'null'
            }
          }
        }
      },
      async (request, reply) => {
        const handler = config.webhooks!.handlers[request.body.event]
        if (!handler) {
          return reply.status(200).send()
        }
        await handler(request.body.payload, request, fastify)
        return reply.status(200).send()
      }
    )
  }
}

export const fastifyOhMySMTP = fp<Configuration>(ohMySMTPPlugin, {
  fastify: '3.x'
})

export default fastifyOhMySMTP
