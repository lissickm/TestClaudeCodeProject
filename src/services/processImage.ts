import type { TimeEntry } from '../types'
import type { ClicktimeData } from './clicktimeData'

export async function processImage(
  imageBase64: string,
  mediaType: string,
  clicktimeData?: ClicktimeData
): Promise<TimeEntry[]> {
  const res = await fetch('/api/process-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-process-secret': import.meta.env.VITE_PROCESS_SECRET ?? '',
    },
    body: JSON.stringify({ imageBase64, mediaType, clicktimeData }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error)

  return data.entries.map((e: Omit<TimeEntry, 'id'>, i: number) => ({ ...e, id: i }))
}
