import { Hono } from 'hono'
import { showRoutes } from 'hono/dev'

type Bindings = {
  KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const key = c.req.query('key')
  if (!key) {
    return c.notFound()
  }
  const value = await c.env.KV.get(key)
  if (!value) {
    return c.notFound()
  }
  return c.text(value)
})

app.put('/', async (c) => {
  const { key, value } = await c.req.parseBody<{
    key: string
    value: string
  }>()
  if (!key || !value) {
    return c.text('key and value are needed', 400)
  }
  await c.env.KV.put(key, value)
  return c.redirect(`/?key=${key}`)
})

showRoutes(app)

export default app
