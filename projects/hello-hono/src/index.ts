import { Hono } from 'hono'

type Bindings = {
  MY_VAR: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  const q = c.req.query('q') ?? ''
  return c.json({
    message: 'Hello',
    path: c.req.path,
    myVar: c.env.MY_VAR,
    query: q
  })
})

export default app
