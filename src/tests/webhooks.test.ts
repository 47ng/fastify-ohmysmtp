import { webhookBody, webhookBodySchema, WebhookJSONBody } from '../webhooks'

describe('webhooks', () => {
  test('body schema', () => {
    const expected = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        event: {
          type: 'string',
          enum: [
            'email.queued',
            'email.delivered',
            'email.deferred',
            'email.bounced',
            'email.spam'
          ]
        },
        payload: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['queued', 'delivered', 'deferred', 'bounced', 'spam']
            },
            id: { type: 'number' },
            domain_id: { type: 'number' },
            created_at: {
              anyOf: [
                { type: 'integer', exclusiveMinimum: 0 },
                { type: 'string', format: 'date-time' }
              ]
            },
            updated_at: { $ref: '#/properties/payload/properties/created_at' },
            from: { type: 'string', format: 'email' },
            to: { type: ['string', 'null'] },
            htmlbody: { type: ['string', 'null'] },
            textbody: { type: ['string', 'null'] },
            cc: { type: ['string', 'null'] },
            bcc: { type: ['string', 'null'] },
            subject: { type: ['string', 'null'] },
            replyto: {
              anyOf: [{ type: 'string', format: 'email' }, { type: 'null' }]
            },
            message_id: { type: 'string' },
            list_unsubscribe: { type: ['string', 'null'] }
          },
          required: [
            'status',
            'id',
            'domain_id',
            'created_at',
            'updated_at',
            'from',
            'to',
            'htmlbody',
            'textbody',
            'cc',
            'bcc',
            'subject',
            'replyto',
            'message_id',
            'list_unsubscribe'
          ],
          additionalProperties: false
        }
      },
      required: ['event', 'payload'],
      additionalProperties: false
    }
    expect(webhookBodySchema).toEqual(expected)
  })

  test('parse correctly shaped webhook body', () => {
    const body: WebhookJSONBody = {
      event: 'email.delivered',
      payload: {
        status: 'delivered',
        id: 1,
        domain_id: 2,
        created_at: 123,
        updated_at: 123,
        message_id: '',
        from: 'alice@example.com',
        replyto: null,
        to: 'bob@example.com',
        cc: null,
        bcc: null,
        subject: 'Hey!',
        htmlbody: 'Hello',
        textbody: 'Hello',
        list_unsubscribe: null
      }
    }
    const result = webhookBody.safeParse(body)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.payload.created_at.valueOf()).toEqual(123)
    }
  })
})
