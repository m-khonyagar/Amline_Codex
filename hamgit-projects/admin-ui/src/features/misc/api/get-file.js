import { apiDownloadFile } from '@/data/api/file'
import { useQuery } from '@tanstack/react-query'

const useGetFile = (fileId, options = {}) => {
  return useQuery({
    queryKey: ['file', fileId],

    queryFn: async () => {
      const result = await apiDownloadFile(fileId)

      return result.data
    },

    enabled: !!fileId,

    ...options,
  })
}

export default useGetFile
