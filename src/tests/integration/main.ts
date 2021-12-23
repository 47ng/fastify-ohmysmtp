import Fastify from 'fastify'
import fastifyOhMySMTP from '../../../dist'

const server = Fastify({
  logger: true
})

server.register(fastifyOhMySMTP, {
  apiToken: 'my-api-token',
  webhooks: {
    path: '/webhook',
    handlers: {
      'email.spam': async (event, req, app) => {
        req.log.info(event)
        await app.ohmysmtp.sendEmail({
          from: 'robots@example.com',
          to: 'admin@example.com',
          subject: 'Spam detected',
          textbody: `Check event ${event.id} on OhMySMTP`
        })
      }
    }
  }
})

server.ready(error => {
  if (error) {
    throw error
  }
  console.log(server.printPlugins())
  console.log(server.printRoutes())
})
