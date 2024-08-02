import { Hono } from 'hono'

type Bindings = {
  BUCKET: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

app.put('/:id', async (c) => {
  const key = c.req.param('id')
  const result = await c.env.BUCKET.put(key, c.req.raw.body)
  return c.json(result)
})

app.get('/:id', async (c) => {
  const key = c.req.param('id')
  const object = await c.env.BUCKET.get(key)
  if (!object) {
    return c.notFound()
  }
  return c.body(object.body)
})

app.delete('/:id', async (c) => {
  const key = c.req.param('id')
  await c.env.BUCKET.delete(key)
  return c.text('Deleted!')
})

export default app
