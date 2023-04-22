import { axiosAuth } from "../axios"

const getUserActivityLog = async (user_id) => {
  const url = `/userlog`
  const response = await axiosAuth.get(url)
  return response.data.data
}

export { getUserActivityLog }
