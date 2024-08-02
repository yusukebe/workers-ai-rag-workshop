import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'

type Bindings = {
  AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()
app.use(prettyJSON())

app.get('/', async (c) => {
  const text = c.req.query('text') ?? 'This is a story about an orange cloud'

  const embeddings = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', { text })

  return c.json(embeddings)
})

export default app
