import { useState, useRef, useMemo } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  CssBaseline,
  FormControlLabel,
  Switch,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid'
import UploadFileIcon from '@mui/icons-material/UploadFile'

type TimeEntry = {
  id: number
  client: string
  project: string
  task: string
  hours: string
  billable: boolean | null
  notes: string
}

const columns: GridColDef[] = [
  { field: 'client',   headerName: 'Client',   flex: 1, minWidth: 130, editable: true },
  { field: 'project',  headerName: 'Project',  flex: 1, minWidth: 150, editable: true },
  { field: 'task',     headerName: 'Task',     flex: 1, minWidth: 150, editable: true },
  { field: 'hours',    headerName: 'Hours',    width: 80,  editable: true },
  { field: 'billable', headerName: 'Billable', width: 90,  editable: true, type: 'boolean' },
  { field: 'notes',    headerName: 'Notes',    flex: 1, minWidth: 150, editable: true },
]

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<string>('image/jpeg')
  const [imageName, setImageName] = useState<string | null>(null)
  const [rows, setRows] = useState<TimeEntry[]>([])
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
    setRows([])
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
    setRows([])
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
      setRows(data.entries.map((e: Omit<TimeEntry, 'id'>, i: number) => ({ ...e, id: i })))
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
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Time Entry Extractor</Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />}
            label="Dark mode"
          />
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
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
              {imageName && (
                <Typography variant="body2" color="text.secondary">{imageName}</Typography>
              )}
            </Box>

            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                alt={imageName ?? 'uploaded image'}
                sx={{ mt: 2, maxWidth: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 2, boxShadow: 3, display: 'block' }}
              />
            )}
          </CardContent>
        </Card>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}

        {rows.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {rows.length} entr{rows.length === 1 ? 'y' : 'ies'} extracted — click any cell to edit
            </Typography>
            <DataGrid
              rows={rows}
              columns={columns}
              processRowUpdate={handleRowUpdate}
              disableRowSelectionOnClick
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
