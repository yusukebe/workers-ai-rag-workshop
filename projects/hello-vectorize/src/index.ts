import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'

type Bindings = {
  VECTORIZE: VectorizeIndex
}

// Based on https://developers.cloudflare.com/vectorize/get-started/intro/#4-insert-vectorsd
const sampleVectors: Array<VectorizeVector> = [
  { id: '1', values: [32.4, 74.1, 3.2], metadata: { url: '/products/sku/13913913' } },
  { id: '2', values: [15.1, 19.2, 15.8], metadata: { url: '/products/sku/10148191' } },
  { id: '3', values: [0.16, 1.2, 3.8], metadata: { url: '/products/sku/97913813' } },
  { id: '4', values: [75.1, 67.1, 29.9], metadata: { url: '/products/sku/418313' } },
  { id: '5', values: [58.8, 6.7, 3.4], metadata: { url: '/products/sku/55519183' } }
]

const app = new Hono<{ Bindings: Bindings }>()
app.use(prettyJSON())

app.get('/', async (c) => {
  const queryVector: Array<number> = [54.8, 5.5, 3.1]
  const matches = await c.env.VECTORIZE.query(queryVector, { topK: 3, returnValues: true, returnMetadata: true })
  return c.json(matches)
})

app.get('/insert', async (c) => {
  const inserted = await c.env.VECTORIZE.insert(sampleVectors)
  return c.json(inserted)
})

export default app
