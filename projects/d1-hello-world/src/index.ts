import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()
app.get(prettyJSON())

app.get('/', async (c) => {
  const stmt = c.env.DB.prepare('SELECT id, text FROM notes LIMIT 10')
  const result = await stmt.all()
  return c.json(result)
})

app.post('/insert', async (c) => {
  const { text } = await c.req.parseBody<{ text: string }>()
  if (!text) {
    return c.text('Post body - `text` is needed', 400)
  }
  const result = await c.env.DB.prepare('INSERT INTO notes (text) VALUES (?1)').bind(text).run()
  return c.json(result)
})

export default app
