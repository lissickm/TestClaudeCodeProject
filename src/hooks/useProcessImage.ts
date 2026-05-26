import { useMutation } from '@tanstack/react-query'
import { processImage } from '../services/processImage'
import type { ClicktimeData } from '../services/clicktimeData'

export function useProcessImage() {
  return useMutation({
    mutationFn: ({ imageBase64, mediaType, clicktimeData }: {
      imageBase64: string
      mediaType: string
      clicktimeData?: ClicktimeData
    }) => processImage(imageBase64, mediaType, clicktimeData),
    retry: false,
  })
}
