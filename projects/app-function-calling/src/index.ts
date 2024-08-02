import { Hono } from 'hono'
import { runWithTools } from '@cloudflare/ai-utils'

const getWeather = async (args: { latitude: string; longitude: string }) => {
  console.log(args)
  // Write your logic.
  return 'Sunny'
}

type Bindings = {
  AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const text = c.req.query('text') ?? 'What is weather in Yokohama'

  const result = await runWithTools(c.env.AI, '@hf/nousresearch/hermes-2-pro-mistral-7b', {
    messages: [{ role: 'user', content: text }],
    tools: [
      {
        name: 'getWeather',
        description: 'Return the weather for a latitude and longitude',
        parameters: {
          type: 'object',
          properties: {
            latitude: {
              type: 'string',
              description: 'The latitude for the given location'
            },
            longitude: {
              type: 'string',
              description: 'The longitude for the given location'
            }
          },
          required: ['latitude', 'longitude']
        },
        function: getWeather
      }
    ]
  })

  return c.json(result)
})

export default app
