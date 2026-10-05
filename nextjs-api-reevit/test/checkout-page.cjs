const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const http = require('node:http')
const ts = require('typescript')

const project = path.resolve(__dirname, '..')

// Exercise the maintained page and request helper. Only framework rendering,
// state and surrounding page services are stubbed; event handlers stay real.
function loadSource(relative, dependencies) {
  const source = fs.readFileSync(path.join(project, relative), 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  } }).outputText
  const module = { exports: {} }
  vm.runInNewContext(code, {
    module, exports: module.exports, require: dependencies, process, fetch,
    crypto: { randomUUID: () => 'page-regression-order' },
  }, { filename: relative })
  return module.exports
}

function find(element, matches) {
  if (!element || typeof element !== 'object') return undefined
  if (matches(element)) return element
  for (const child of [element.props?.children].flat(Infinity)) {
    const result = find(child, matches)
    if (result) return result
  }
}

function textIn(element) {
  if (typeof element === 'string' || typeof element === 'number') return String(element)
  if (!element || typeof element !== 'object') return ''
  return [element?.props?.children].flat(Infinity).map(textIn).join(' ')
}

test('the checkout page retains its first order after an ambiguous response failure', async () => {
  const requests = []
  const server = http.createServer(async (request, response) => {
    let body = ''
    for await (const part of request) body += part
    requests.push({ key: request.headers['idempotency-key'], payload: JSON.parse(body) })
    if (requests.length === 1) {
      // The API received the request, but the client cannot see its outcome.
      request.socket.destroy()
      return
    }
    response.setHeader('content-type', 'application/json')
    if (body !== JSON.stringify(requests[0].payload)) {
      response.writeHead(409)
      response.end(JSON.stringify({ message: 'Idempotency key conflicts with the first request' }))
      return
    }
    response.end(JSON.stringify({ id: 'pay_page_order', status: 'requires_action' }))
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const oldUrl = process.env.NEXT_PUBLIC_REEVIT_BASE_URL
  process.env.NEXT_PUBLIC_REEVIT_BASE_URL = `http://127.0.0.1:${server.address().port}`
  try {
    const helper = loadSource('lib/checkout.ts', require)
    const state = []
    let slot = 0
    let cart = { items: [{ product: { id: 'prd_first', name: 'First order item',
      image: 'fixture.png', price: 5000 }, quantity: 1 }], total: 5000 }
    let cleared = 0
    const navigations = []
    const jsx = (type, props) => ({ type, props })
    const components = new Proxy({}, { get: (_, name) => name })
    const CheckoutPage = loadSource('app/checkout/page.tsx', (name) => {
      if (name === 'react') return { useState(initial) {
        const index = slot++
        if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial
        return [state[index], (value) => { state[index] = value }]
      } }
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx }
      if (name === 'next/navigation') return { useRouter: () => ({
        push: (url) => navigations.push(url),
      }) }
      if (name === '@/lib/cart') return { useCart: () => ({ ...cart,
        clearCart() { cleared++ },
      }) }
      if (name === '@/lib/checkout') return helper
      if (name === '@/lib/products') return { formatPrice: (amount, currency = 'GHS') => `${currency} ${amount}` }
      if (name === '@/components/Toaster') return { toast: { error() {}, success() {} } }
      return components
    }).default
    const render = () => { slot = 0; return CheckoutPage() }
    const input = (tree, type) => find(tree, (element) => element.type === 'Input' && element.props.type === type)
    const country = (tree) => find(tree, (element) => element.type === 'select')
    const submit = (tree) => find(tree, (element) => element.type === 'Button' && element.props.onClick)

    let tree = render()
    input(tree, 'text').props.onChange({ target: { value: 'First Shopper' } })
    input(tree, 'email').props.onChange({ target: { value: 'first@example.test' } })
    tree = render()
    await submit(tree).props.onClick()
    tree = render()
    assert.equal(requests.length, 1)
    assert.equal(cleared, 0)
    assert.deepEqual(navigations, [])
    assert.equal(input(tree, 'text').props.disabled, true)
    assert.equal(input(tree, 'email').props.disabled, true)
    assert.equal(country(tree).props.disabled, true)
    assert.match(textIn(submit(tree)), /Retry GHS 5000/)
    assert.ok(find(tree, (element) => element.props?.role === 'status'))

    // Even external cart updates and direct event delivery cannot change the
    // saved request. Normal browser users cannot edit the disabled controls.
    input(tree, 'text').props.onChange({ target: { value: 'Other Shopper' } })
    input(tree, 'email').props.onChange({ target: { value: 'other@example.test' } })
    country(tree).props.onChange({ target: { value: 'NG' } })
    cart = { items: [], total: 0 }
    tree = render()
    assert.match(textIn(tree), /First order item/)
    assert.match(textIn(submit(tree)), /Retry GHS 5000/)
    await submit(tree).props.onClick()
    assert.equal(requests.length, 2)
    assert.deepEqual(requests[1], requests[0])
    assert.equal(requests[0].key, 'checkout:ORD-page-regression-order')
    assert.equal(requests[0].payload.metadata.customer_email, 'first@example.test')
    assert.equal(requests[0].payload.currency, 'GHS')
    assert.equal(cleared, 1)
    assert.deepEqual(navigations, ['/payment/pay_page_order'])
  } finally {
    if (oldUrl === undefined) delete process.env.NEXT_PUBLIC_REEVIT_BASE_URL
    else process.env.NEXT_PUBLIC_REEVIT_BASE_URL = oldUrl
    await new Promise((resolve) => server.close(resolve))
  }
})
