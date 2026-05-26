import { useGridApiContext, DataGrid } from '@mui/x-data-grid'
import type { GridColDef, GridRowModel, GridRenderEditCellParams } from '@mui/x-data-grid'
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { DeleteOutlined as DeleteOutlineIcon } from '@mui/icons-material'
import type { TimeEntry } from '../types'

function NotesEditCell(params: GridRenderEditCellParams) {
  const api = useGridApiContext()

  return (
    <TextField
      multiline
      fullWidth
      autoFocus
      variant="standard"
      value={params.value ?? ''}
      onChange={(e) => api.current.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
      sx={{ px: 1, '& .MuiInput-root': { fontSize: 13 } }}
      slotProps={{ input: { style: { resize: 'none' } } }}
    />
  )
}

type Props = {
  rows: TimeEntry[]
  onRowUpdate: (newRow: GridRowModel) => GridRowModel
  onRowDelete: (id: number) => void
}

export default function TimeEntryGrid({ rows, onRowUpdate, onRowDelete }: Props) {
  const columns: GridColDef[] = [
    { field: 'client',   headerName: 'Client',   flex: 1, minWidth: 140, editable: true },
    { field: 'project',  headerName: 'Project',  flex: 1, minWidth: 160, editable: true },
    { field: 'task',     headerName: 'Task',     flex: 1, minWidth: 160, editable: true },
    { field: 'hours',    headerName: 'Hours',    width: 80,  editable: true },
    { field: 'billable', headerName: 'Billable', width: 90,  editable: true, type: 'boolean' },
    {
      field: 'notes',
      headerName: 'Notes',
      flex: 1,
      minWidth: 160,
      editable: true,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: 'normal', lineHeight: 1.4, py: 1, fontSize: 13 }}>
          {params.value}
        </Box>
      ),
      renderEditCell: (params) => <NotesEditCell {...params} />,
    },
    {
      field: 'actions',
      headerName: '',
      width: 56,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="Remove row">
          <IconButton
            size="small"
            onClick={() => onRowDelete(params.row.id)}
            sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {rows.length} entr{rows.length === 1 ? 'y' : 'ies'} extracted — click any cell to edit
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        processRowUpdate={onRowUpdate}
        disableRowSelectionOnClick
        autoHeight
        getRowHeight={() => 'auto'}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{ '& .MuiDataGrid-cell': { alignItems: 'flex-start', py: 1 } }}
      />
    </Box>
  )
}
