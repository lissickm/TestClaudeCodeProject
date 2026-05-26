import { useState } from 'react'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import type { GridRowModel } from '@mui/x-data-grid'
import Header from './components/Header'
import ImageUploader from './components/ImageUploader'
import TimeEntryGrid from './components/TimeEntryGrid'
import GridSkeleton from './components/GridSkeleton'
import ErrorAlert from './components/ErrorAlert'
import { useClicktimeData } from './hooks/useClicktimeData'
import { useProcessImage } from './hooks/useProcessImage'
import { buildTheme } from './theme'
import type { TimeEntry } from './types'
import { useMemo } from 'react'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [rows, setRows] = useState<TimeEntry[]>([])
  const [hasProcessed, setHasProcessed] = useState(false)

  const theme = useMemo(() => buildTheme(darkMode), [darkMode])

  const clicktimeData = useClicktimeData()
  const { mutate: processImage, isPending, error, reset } = useProcessImage()

  function handleProcess(imageBase64: string, mediaType: string) {
    setRows([])
    processImage(
      { imageBase64, mediaType },
      { onSuccess: (entries) => { setRows(entries); setHasProcessed(true) } }
    )
  }

  function handleRowUpdate(newRow: GridRowModel) {
    setRows((prev) => prev.map((r) => (r.id === newRow.id ? (newRow as TimeEntry) : r)))
    return newRow
  }

  function handleRowDelete(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  function handleRowAdd() {
    const newId = Math.max(0, ...rows.map((r) => r.id)) + 1
    setRows((prev) => [...prev, { id: newId, client: '', project: '', task: '', hours: '', billable: null, notes: '' }])
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header darkMode={darkMode} onToggle={setDarkMode} />
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
        <ImageUploader
          loading={isPending}
          clicktimeLoading={clicktimeData.isLoading}
          onProcess={handleProcess}
        />
        <ErrorAlert error={error instanceof Error ? error : null} onDismiss={reset} />
        {isPending && <GridSkeleton />}
        {!isPending && hasProcessed && (
          <TimeEntryGrid rows={rows} onRowUpdate={handleRowUpdate} onRowDelete={handleRowDelete} onRowAdd={handleRowAdd} />
        )}
      </Box>
    </ThemeProvider>
  )
}
