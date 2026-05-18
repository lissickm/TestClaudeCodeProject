import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  FormControlLabel,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  const theme = useMemo(
    () => createTheme({ palette: { mode: darkMode ? 'dark' : 'light' } }),
    [darkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card sx={{ p: 2, minWidth: 320, textAlign: 'center' }}>
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

            <Typography variant="h4" gutterBottom>
              MUI Example
            </Typography>

            <TextField
              label="Your name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 3 }}
            />

            {name && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                Hello, {name}!
              </Typography>
            )}

            <Typography variant="h6" sx={{ mb: 2 }}>
              Count: {count}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button variant="contained" onClick={() => setCount((c) => c + 1)}>
                Increment
              </Button>
              <Button variant="outlined" onClick={() => setCount(0)}>
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  )
}

export default App
