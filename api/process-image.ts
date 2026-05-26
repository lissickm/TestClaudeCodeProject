import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

type ClicktimeClient  = { id: string; name: string }
type ClicktimeProject = { id: string; name: string; clientId: string }
type ClicktimeTask    = { id: string; name: string; clientId: string }
type ClicktimeData    = { clients: ClicktimeClient[]; projects: ClicktimeProject[]; tasks: ClicktimeTask[] }

function buildHierarchyPrompt(data: ClicktimeData): string {
  return data.clients.map((c) => {
    const projects = data.projects.filter((p) => p.clientId === c.id).map((p) => p.name).join(', ')
    const tasks    = data.tasks.filter((t) => t.clientId === c.id).map((t) => t.name).join(', ')
    return `Client: ${c.name}\n  Projects: ${projects || 'none'}\n  Tasks: ${tasks || 'none'}`
  }).join('\n\n')
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (req.headers['x-process-secret'] !== process.env.PROCESS_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { imageBase64, mediaType, clicktimeData } = req.body

  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' })
  }

  const hierarchySection = clicktimeData
    ? `\nAvailable ClickTime data — match extracted values to the closest name from these lists:\n\n${buildHierarchyPrompt(clicktimeData)}\n`
    : ''

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
              text: `This image contains time entry data. Extract every entry and return a JSON array with this exact shape:
[
  {
    "client": "string",
    "project": "string",
    "task": "string",
    "hours": "string",
    "billable": true | false | null,
    "notes": "string"
  }
]
${hierarchySection}
Rules:
- One object per entry
- Match "client", "project", and "task" to the closest name from the available data above — use exact names as listed
- "hours" is total hours as a string (e.g. "2.5", "3.25")
- "billable" is true if marked billable, false if non-billable, null if not indicated
- "notes" is any note text, or empty string if none
- Return only the raw JSON array, no explanation or markdown`,
            },
          ],
        },
      ],
    })

    const raw     = response.content[0].type === 'text' ? response.content[0].text : '[]'
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const entries = JSON.parse(cleaned)
    return res.status(200).json({ entries })
  } catch (error: any) {
    return res.status(500).json({ error: error.message ?? 'Failed to process image' })
  }
}
