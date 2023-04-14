import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  //console.log("WTF");
  const { setAuth } = useAuth()

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    })
    setAuth((prev) => {
      //console.log("SET AUTH WITH: " + JSON.stringify(response.data))
      return {
        ...prev,
        email: response.data.email,
        roles: response.data.roles,
        access_token: response.data.access_token,
        user_id: response.data.user_id,
      }
    })
    return response.data.access_token
  }
  return refresh
}

export default useRefreshToken
