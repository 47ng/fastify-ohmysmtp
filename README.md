<h1 align="center"><code>fastify-ohmysmtp</code></h1>

<div align="center">

[![NPM](https://img.shields.io/npm/v/fastify-ohmysmtp?color=red)](https://www.npmjs.com/package/fastify-ohmysmtp)
[![MIT License](https://img.shields.io/github/license/47ng/fastify-ohmysmtp.svg?color=blue)](https://github.com/47ng/fastify-ohmysmtp/blob/main/LICENSE)
[![Continuous Integration](https://github.com/47ng/fastify-ohmysmtp/workflows/Continuous%20Integration/badge.svg?branch=next)](https://github.com/47ng/fastify-ohmysmtp/actions)
[![Coverage Status](https://coveralls.io/repos/github/47ng/fastify-ohmysmtp/badge.svg?branch=next)](https://coveralls.io/github/47ng/fastify-ohmysmtp?branch=next)

</div>

<p align="center">
  <a href="https://fastify.io">Fastify</a> plugin for <a href="https://ohmysmtp.com/">OhMySMTP</a>
</p>

## Features

- Send emails
- Webhooks
- Inbound emails _(coming soon)_

## Installation

```shell
$ yarn add fastify-ohmysmtp
# or
$ npm i fastify-ohmysmtp
```

## Usage

Minimal example:

```ts
import Fastify from 'fastify'
import fastifyOhMySMTP from 'fastify-ohmysmtp'

const server = Fastify()

server.register(fastifyOhMySMTP, {
  apiToken: 'my-api-token'
})

server.ohmysmtp.sendEmail({
  from: 'test@example.com',
  to: 'test@example.com',
  subject: 'test',
  htmlbody: '<h1>HTML Email</h1>'
})
```

## Environment Variables

You can provide the API token via the configuration or via the `OHMYSMTP_API_TOKEN` environment variable.

## Webhooks

You can enable reception of webhook events in the configuration object:

```ts
server.register(fastifyOhMySMTP, {
  apiToken: 'my-api-token',
  webhooks: {
    // Where to attach the webhook endpoint (POST)
    path: '/webhook',

    /*
     * An object map of handlers, where keys are the event types, listed here:
     * https://docs.ohmysmtp.com/guide/webhooks#email-events
     *
     * Values are async handlers that take as argument:
     * - The payload object of the webhook event
     * - The request object from Fastify
     * - The Fastify instance
     */
    handlers: {
      'email.spam': async (event, req, fastify) => {
        req.log.info(event, 'Spam detected')
        await fastify.ohmysmtp.sendEmail({
          from: 'robots@example.com',
          to: 'admin@example.com',
          subject: 'Spam detected',
          textbody: `Check event ${event.id} on OhMySMTP`
        })
      }
    },

    // You can pass additional Fastify route props here:
    routeConfig: {
      logLevel: 'warn'
    }
  }
})
```

## License

[MIT](https://github.com/47ng/fastify-ohmysmtp/blob/main/LICENSE) - Made with ❤️ by [François Best](https://francoisbest.com)

Using this package at work ? [Sponsor me](https://github.com/sponsors/franky47) to help with support and maintenance.
