const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { createPaymentIntent } = require('../.test-build/checkout.js')

test('HTTP quickstart preserves the order key and payload on retries', async () => {
  const seen = []
  const server = http.createServer(async (request, response) => {
    let body = ''
    for await (const part of request) body += part
    seen.push({ path: request.url, key: request.headers['idempotency-key'], body: JSON.parse(body) })
    response.setHeader('content-type', 'application/json')
    response.end(JSON.stringify({ id: 'pay_example', status: 'requires_action' }))
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const oldUrl = process.env.NEXT_PUBLIC_REEVIT_BASE_URL
  process.env.NEXT_PUBLIC_REEVIT_BASE_URL = `http://127.0.0.1:${server.address().port}`
  try {
    const payload = { amount: 5000, currency: 'GHS', method: 'card', country: 'GH', reference: 'order_123', metadata: {} }
    for (let i = 0; i < 2; i++) {
      assert.equal((await createPaymentIntent(payload, 'checkout:order_123')).id, 'pay_example')
    }
    assert.equal(seen.length, 2)
    assert.deepEqual(seen[0], seen[1])
    assert.equal(seen[0].path, '/v1/payments/intents')
    assert.equal(seen[0].key, 'checkout:order_123')
    await assert.rejects(createPaymentIntent(payload, ''), /idempotency key/)
    assert.equal(seen.length, 2)
  } finally {
    if (oldUrl === undefined) delete process.env.NEXT_PUBLIC_REEVIT_BASE_URL
    else process.env.NEXT_PUBLIC_REEVIT_BASE_URL = oldUrl
    await new Promise((resolve) => server.close(resolve))
  }
})
