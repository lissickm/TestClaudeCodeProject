import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (req.headers['x-process-secret'] !== process.env.PROCESS_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { imageBase64, mediaType } = req.body

  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType ?? 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `This image contains time management data. Extract every entry and return a JSON array with this exact shape:
[
  {
    "customer": "string",
    "hours": "string",
    "tasksCompleted": ["string"]
  }
]

Rules:
- One object per customer entry
- "hours" should be the amount of time worked as a string (e.g. "2.5", "3h", whatever is in the image)
- "tasksCompleted" is an array of individual task strings
- Return only the raw JSON array, no explanation or markdown`,
            },
          ],
        },
      ],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : '[]'
    const entries = JSON.parse(raw)
    return res.status(200).json({ entries })
  } catch (error: any) {
    return res.status(500).json({ error: error.message ?? 'Failed to process image' })
  }
}
