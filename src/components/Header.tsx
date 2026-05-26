import { AppBar, FormControlLabel, Switch, Toolbar, Typography } from '@mui/material'

type Props = {
  darkMode: boolean
  onToggle: (val: boolean) => void
}

export default function Header({ darkMode, onToggle }: Props) {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1, letterSpacing: '0.5px' }}>
          ClickTime — Time Entry Extractor
        </Typography>
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
