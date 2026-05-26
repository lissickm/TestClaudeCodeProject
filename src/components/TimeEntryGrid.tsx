import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef, GridRowModel } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import type { TimeEntry } from '../types'

const columns: GridColDef[] = [
  { field: 'client',   headerName: 'Client',   flex: 1, minWidth: 140, editable: true },
  { field: 'project',  headerName: 'Project',  flex: 1, minWidth: 160, editable: true },
  { field: 'task',     headerName: 'Task',     flex: 1, minWidth: 160, editable: true },
  { field: 'hours',    headerName: 'Hours',    width: 80,  editable: true },
  { field: 'billable', headerName: 'Billable', width: 90,  editable: true, type: 'boolean' },
  { field: 'notes',    headerName: 'Notes',    flex: 1, minWidth: 160, editable: true },
]

type Props = {
  rows: TimeEntry[]
  onRowUpdate: (newRow: GridRowModel) => GridRowModel
}

export default function TimeEntryGrid({ rows, onRowUpdate }: Props) {
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
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      />
    </Box>
  )
}
