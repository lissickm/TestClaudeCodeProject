import { useQuery } from '@tanstack/react-query'
import { fetchClicktimeData } from '../services/clicktimeData'

export function useClicktimeData() {
  return useQuery({
    queryKey: ['clicktimeData'],
    queryFn: fetchClicktimeData,
  })
}
