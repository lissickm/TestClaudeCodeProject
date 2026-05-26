import { useState, useMemo } from 'react'
import { Box, CssBaseline, ThemeProvider, Typography } from '@mui/material'
import type { GridRowModel } from '@mui/x-data-grid'
import Header from './components/Header'
import ImageUploader from './components/ImageUploader'
import TimeEntryGrid from './components/TimeEntryGrid'
import { processImage } from './services/processImage'
import { buildTheme } from './theme'
import type { TimeEntry } from './types'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [rows, setRows] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const theme = useMemo(() => buildTheme(darkMode), [darkMode])

  async function handleProcess(imageBase64: string, mediaType: string) {
    setLoading(true)
    setRows([])
    setError(null)
    try {
      setRows(await processImage(imageBase64, mediaType))
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleRowUpdate(newRow: GridRowModel) {
    setRows((prev) => prev.map((r) => (r.id === newRow.id ? (newRow as TimeEntry) : r)))
    return newRow
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header darkMode={darkMode} onToggle={setDarkMode} />
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
        <ImageUploader loading={loading} onProcess={handleProcess} />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        {rows.length > 0 && <TimeEntryGrid rows={rows} onRowUpdate={handleRowUpdate} />}
      </Box>
    </ThemeProvider>
  )
}
