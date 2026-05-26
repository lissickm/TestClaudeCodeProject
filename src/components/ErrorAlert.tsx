import { Alert } from '@mui/material'

type Props = {
  error: Error | null
  onDismiss: () => void
}

function friendlyMessage(error: Error): string {
  const msg = error.message.toLowerCase()
  if (msg.includes('401') || msg.includes('unauthorized')) return 'Authentication failed — check your API credentials.'
  if (msg.includes('429') || msg.includes('rate limit'))   return 'Rate limit reached — please wait a moment and try again.'
  if (msg.includes('network') || msg.includes('fetch'))    return 'Network error — check your connection and try again.'
  return error.message || 'Something went wrong. Please try again.'
}

export default function ErrorAlert({ error, onDismiss }: Props) {
  if (!error) return null
  return (
    <Alert severity="error" onClose={onDismiss} sx={{ mb: 2 }}>
      {friendlyMessage(error)}
    </Alert>
  )
}
