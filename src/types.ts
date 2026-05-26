export type TimeEntry = {
  id: number
  client: string
  project: string
  task: string
  hours: string
  billable: boolean | null
  notes: string
}
