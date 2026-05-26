import { Box, Skeleton } from '@mui/material'

const ROW_COUNT = 4
const COLUMNS = [140, 160, 160, 80, 90, 160, 56]

export default function GridSkeleton() {
  return (
    <Box sx={{ border: '1px solid #d0d7e2', borderRadius: 1, overflow: 'hidden' }}>
      {/* header */}
      <Box sx={{ display: 'flex', gap: 1, px: 2, py: 1.5, bgcolor: 'action.hover' }}>
        {COLUMNS.map((w, i) => (
          <Skeleton key={i} variant="text" width={w} height={16} />
        ))}
      </Box>
      {/* rows */}
      {Array.from({ length: ROW_COUNT }).map((_, row) => (
        <Box
          key={row}
          sx={{ display: 'flex', gap: 1, px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}
        >
          {COLUMNS.map((w, i) => (
            <Skeleton key={i} variant="text" width={w} height={16} />
          ))}
        </Box>
      ))}
    </Box>
  )
}
