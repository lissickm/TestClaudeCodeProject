import { useMutation } from '@tanstack/react-query'
import { processImage } from '../services/processImage'

export function useProcessImage() {
  return useMutation({
    mutationFn: ({ imageBase64, mediaType }: { imageBase64: string; mediaType: string }) =>
      processImage(imageBase64, mediaType),
    retry: false, // each attempt costs API credits
  })
}
