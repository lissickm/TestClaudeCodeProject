import { useRef, useState } from 'react'
import { Box, Button, Card, CardContent, CircularProgress, Tooltip, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'

type Props = {
  loading: boolean
  clicktimeLoading: boolean
  onProcess: (imageBase64: string, mediaType: string) => void
}

export default function ImageUploader({ loading, clicktimeLoading, onProcess }: Props) {
  const busy = loading || clicktimeLoading
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState('image/jpeg')
  const [imageName, setImageName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageName(file.name)
    setMediaType(file.type || 'image/jpeg')
    setImageUrl(URL.createObjectURL(file))

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setImageBase64(result.split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  return (
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
            color="primary"
            startIcon={<UploadFileIcon />}
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            Choose Image
          </Button>
          <Tooltip title={!imageUrl ? 'Choose an image first' : ''}>
            <span>
              <Button
                variant="contained"
                color="secondary"
                disabled={!imageUrl || loading}
                onClick={() => imageBase64 && onProcess(imageBase64, mediaType)}
                sx={{ minWidth: 100 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Process'}
              </Button>
            </span>
          </Tooltip>
          {imageName && (
            <Typography variant="body2" color="text.secondary">{imageName}</Typography>
          )}
        </Box>

        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt={imageName ?? 'uploaded image'}
            sx={{ mt: 2, maxWidth: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 1, boxShadow: 2, display: 'block' }}
          />
        )}
      </CardContent>
    </Card>
  )
}
