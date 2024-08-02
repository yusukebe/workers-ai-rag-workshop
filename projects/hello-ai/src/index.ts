import { Hono } from 'hono'

type Bindings = {
  AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()

const defaultPrompt = 'What is the origin of the phrase Hello, World'

app.get('/', async (c) => {
  const prompt = c.req.query('prompt') ?? defaultPrompt
  const result = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
    prompt
  })
  return c.json(result)
})

app.get('/stream', async (c) => {
  const prompt = c.req.query('prompt') ?? defaultPrompt
  const stream = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
    prompt,
    stream: true
  })

  if (!(stream instanceof ReadableStream)) {
    return c.json(stream)
  }

  return c.body(stream, {
    headers: {
      'Content-Type': 'text/event-stream;charset=UTF-8',
      'Transfer-Encoding': 'chunked'
    }
  })
})

export default app
