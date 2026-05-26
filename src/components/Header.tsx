import { AppBar, Button, FormControlLabel, Switch, Toolbar, Typography } from '@mui/material'
import { Print as PrintIcon } from '@mui/icons-material'
import type { ClicktimeData } from '../services/clicktimeData'
import { openPrintTemplate } from '../services/printTemplate'

type Props = {
  darkMode: boolean
  onToggle: (val: boolean) => void
  clicktimeData?: ClicktimeData
}

export default function Header({ darkMode, onToggle, clicktimeData }: Props) {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1, letterSpacing: '0.5px' }}>
          ClickTime — Time Entry Extractor
        </Typography>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={() => openPrintTemplate(clicktimeData)}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          Print Template
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => onToggle(e.target.checked)}
              sx={{ '& .MuiSwitch-track': { bgcolor: 'rgba(255,255,255,0.3)' } }}
            />
          }
          label={<Typography variant="body2" sx={{ color: 'white' }}>Dark mode</Typography>}
        />
      </Toolbar>
    </AppBar>
  )
}
