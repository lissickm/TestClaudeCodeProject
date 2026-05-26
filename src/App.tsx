import { useState, useMemo } from 'react'
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

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [rows, setRows] = useState<TimeEntry[]>([])
  const [hasProcessed, setHasProcessed] = useState(false)

  const theme = useMemo(() => buildTheme(darkMode), [darkMode])

  const { data: clicktimeData, isLoading: clicktimeLoading } = useClicktimeData()
  const { mutate: processImage, isPending, error, reset } = useProcessImage()

  function handleProcess(imageBase64: string, mediaType: string) {
    setRows([])
    processImage(
      { imageBase64, mediaType, clicktimeData },
      { onSuccess: (entries) => { setRows(entries); setHasProcessed(true) } }
    )
  }

  function handleRowUpdate(newRow: GridRowModel) {
    const prev = rows.find((r) => r.id === newRow.id)
    // clear project and task when client changes
    const updated = prev?.client !== newRow.client
      ? { ...newRow, project: '', task: '' }
      : newRow
    setRows((prev) => prev.map((r) => (r.id === updated.id ? (updated as TimeEntry) : r)))
    return updated
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
      <Header darkMode={darkMode} onToggle={setDarkMode} clicktimeData={clicktimeData} />
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
        <ImageUploader loading={isPending} clicktimeLoading={clicktimeLoading} onProcess={handleProcess} />
        <ErrorAlert error={error instanceof Error ? error : null} onDismiss={reset} />
        {isPending && <GridSkeleton />}
        {!isPending && hasProcessed && (
          <TimeEntryGrid
            rows={rows}
            clicktimeData={clicktimeData}
            onRowUpdate={handleRowUpdate}
            onRowDelete={handleRowDelete}
            onRowAdd={handleRowAdd}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
