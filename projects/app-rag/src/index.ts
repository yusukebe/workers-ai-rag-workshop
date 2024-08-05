import { Hono } from 'hono'

type Bindings = {
  AI: Ai
  DB: D1Database
  VECTORIZE: VectorizeIndex
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const text = c.req.query('text') || 'What is the square root of 9?'

  const embeddingResult = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text
  })

  const vectorizeResult = await c.env.VECTORIZE.query(embeddingResult.data[0], { topK: 5 })

  const CUTOFF = 0.7
  const vectorIds = vectorizeResult.matches
    .filter((vector) => {
      return vector.score > CUTOFF
    })
    .map((vector) => vector.id)

  const notes: string[] = []

  if (vectorIds.length) {
    const query = `SELECT * FROM notes WHERE id IN (${vectorIds.join(', ')})`
    const d1Result = await c.env.DB.prepare(query).bind().all()
    if (d1Result.success) {
      d1Result.results.forEach((entry) => {
        notes.push(entry.text as string)
      })
    }
  }

  const contextMessage = notes.length ? `Context: \n${notes.map((note) => `- ${note}`).join('\n')}` : ''
  const systemPrompt = 'Answer the given question based on the context.'
  const messages: RoleScopedChatInput[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: text }
  ]

  if (contextMessage) {
    messages.unshift({ role: 'system', content: contextMessage })
  }

  const aiResult = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
    messages
  })

  return c.json(aiResult)
})

app.post('/notes', async (c) => {
  const { text } = await c.req.parseBody<{ text: string }>()
  if (!text) {
    return c.redirect('/')
  }

  const d1Result = await c.env.DB.prepare('INSERT INTO notes (text) VALUES (?)').bind(text).run()
  if (!d1Result.success) {
    return c.text('Fail to create a note', 500)
  }

  const aiResult = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text
  })
  const values = aiResult.data[0]
  if (!values) {
    return c.text('Fail to generate vector embeddings')
  }

  const vectorizeResult = await c.env.VECTORIZE.insert([
    {
      id: d1Result.meta.last_row_id.toString(),
      values
    }
  ])

  return c.json(vectorizeResult)
})

export default app
