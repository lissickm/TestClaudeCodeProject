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
      max_tokens: 2048,
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
              text: `This image contains a ClickTime timesheet. Extract every time entry row and return a JSON array with this exact shape:
[
  {
    "client": "string",
    "project": "string",
    "task": "string",
    "hours": "string",
    "billable": true | false | null,
    "notes": "string",
    "customFields": { "fieldName": "value" }
  }
]

Rules:
- One object per time entry row
- "client" is the client name
- "project" is the project name or code
- "task" is the task description
- "hours" is the total hours as a string (e.g. "2.5", "3.25")
- "billable" is true if marked billable, false if non-billable, null if not indicated
- "notes" is any note text associated with the entry, or empty string if none
- "customFields" is an object of any additional fields visible in the entry, or empty object if none
- Return only the raw JSON array, no explanation or markdown`,
            },
          ],
        },
      ],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : '[]'
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const entries = JSON.parse(cleaned)
    return res.status(200).json({ entries })
  } catch (error: any) {
    return res.status(500).json({ error: error.message ?? 'Failed to process image' })
  }
}
