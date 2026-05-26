import { useState, useRef, useMemo } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControlLabel,
  Switch,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'

type TimeEntry = {
  client: string
  project: string
  task: string
  hours: string
  billable: boolean | null
  notes: string
  customFields: Record<string, string>
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<string>('image/jpeg')
  const [imageName, setImageName] = useState<string | null>(null)
  const [entries, setEntries] = useState<TimeEntry[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const theme = useMemo(
    () => createTheme({ palette: { mode: darkMode ? 'dark' : 'light' } }),
    [darkMode]
  )

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageName(file.name)
    setMediaType(file.type || 'image/jpeg')
    setImageUrl(URL.createObjectURL(file))
    setEntries(null)
    setError(null)

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setImageBase64(result.split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  async function handleProcess() {
    if (!imageBase64) return
    setLoading(true)
    setEntries(null)
    setError(null)

    try {
      const res = await fetch('/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-process-secret': import.meta.env.VITE_PROCESS_SECRET ?? '',
        },
        body: JSON.stringify({ imageBase64, mediaType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEntries(data.entries)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card sx={{ p: 2, minWidth: 360, maxWidth: 600, width: '100%', textAlign: 'center' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                }
                label="Dark mode"
              />
            </Box>

            <Typography variant="h5" gutterBottom>
              Time Entry Extractor
            </Typography>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                onClick={() => inputRef.current?.click()}
              >
                Choose Image
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={!imageUrl || loading}
                onClick={handleProcess}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Process'}
              </Button>
            </Box>

            {imageUrl && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {imageName}
                </Typography>
                <Box
                  component="img"
                  src={imageUrl}
                  alt={imageName ?? 'uploaded image'}
                  sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
                />
              </Box>
            )}

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            {entries && entries.length > 0 && (
              <Box sx={{ mt: 2, textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Extracted Entries
                </Typography>
                {entries.map((entry, i) => (
                  <Box key={i} sx={{ p: 2, mb: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{entry.client}</Typography>
                      {entry.billable !== null && (
                        <Typography variant="caption" sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: entry.billable ? 'success.main' : 'warning.main', color: 'white' }}>
                          {entry.billable ? 'Billable' : 'Non-billable'}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">{entry.project}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{entry.task}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="body2">Hours: <strong>{entry.hours}</strong></Typography>
                    {entry.notes && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>Notes: {entry.notes}</Typography>
                    )}
                    {Object.keys(entry.customFields ?? {}).length > 0 && (
                      <Box sx={{ mt: 0.5 }}>
                        {Object.entries(entry.customFields).map(([key, val]) => (
                          <Typography key={key} variant="body2">{key}: {val}</Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  )
}

export default App
