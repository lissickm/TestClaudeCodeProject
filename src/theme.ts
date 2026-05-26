import { createTheme } from '@mui/material'
import type {} from '@mui/x-data-grid/themeAugmentation'

const clicktimeBlue = '#1B5FAB'
const clicktimeBlueDark = '#154d8a'
const clicktimeBlueFaded = '#e8f0fb'

export function buildTheme(dark: boolean) {
  return createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: {
        main: clicktimeBlue,
        dark: clicktimeBlueDark,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#e65c00',
        contrastText: '#ffffff',
      },
      background: {
        default: dark ? '#1a1f2e' : '#f4f6f9',
        paper: dark ? '#242938' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
      fontSize: 13,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 3,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            border: '1px solid #d0d7e2',
            fontSize: 13,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: dark ? '#2e3650' : '#dce6f4',
              color: dark ? '#ffffff' : '#1a3a5c',
              fontWeight: 700,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: dark ? '#2a3245' : clicktimeBlueFaded,
            },
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: dark ? '#2a3a5c' : '#d0e2f7',
            },
            '& .MuiDataGrid-cell--editing': {
              backgroundColor: dark ? '#3a4a2a' : '#fffde7',
              outline: `2px solid ${clicktimeBlue} !important`,
              outlineOffset: '-2px',
            },
            '& .MuiDataGrid-cell:focus': {
              outline: `2px solid ${clicktimeBlue}`,
              outlineOffset: '-2px',
            },
          },
        },
      },
    },
  })
}
