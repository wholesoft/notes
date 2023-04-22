import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserActivityLog } from "./apiAppLog"

const useUserActivityLog = (user_id) => {
  const selectQuery = useQuery({
    queryKey: ["applog", user_id],
    queryFn: () => getUserActivityLog(user_id),
    refetchOnReconnect: false,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
  return selectQuery
}

export { useUserActivityLog }
