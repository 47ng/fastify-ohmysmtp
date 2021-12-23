import OhMySMTP from '@ohmysmtp/ohmysmtp.js'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

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
}

async function ohMySMTPPlugin(fastify: FastifyInstance, config: Configuration) {
  const apiToken = config.apiToken ?? process.env.OHMYSMTP_API_TOKEN
  if (!apiToken) {
    throw new Error('[fastify-ohmysmtp] Missing API token for OhMySMTP')
  }
  const client = new OhMySMTP.DomainClient(apiToken)
  fastify.decorate('ohmysmtp', client)
}

export const fastifyOhMySMTP = fp(ohMySMTPPlugin, {
  fastify: '3.x'
})

export default fastifyOhMySMTP
