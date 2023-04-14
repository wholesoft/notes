import axios from "axios"
import { useNavigate } from "react-router-dom"

let BASE_URL = "https://notes-api.wholesoft.net"

if (process.env.NODE_ENV == "development") {
  BASE_URL = "http://localhost:3001"
}

export default axios.create({
  baseURL: BASE_URL,
})

const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

const refreshAccessToken = async () => {
  const response = await axiosAuth.get("/refresh", { withCredentials: true })
  console.log("REFRESH AUTH TOKEN: " + JSON.stringify(response.data))
  localStorage.setItem("atoken", response.data.access_token)
  return response.data.access_token
}

axiosAuth.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      const atoken = localStorage.getItem("atoken")
      /*
      console.log(
        "INTERCEPT REQUEST.  ATTACHING AUTHORIZATION ACCESS TOKEN: Bearer " +
          atoken
      )
      */

      config.headers["Authorization"] = `Bearer ${atoken}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

axiosAuth.interceptors.response.use(
  (response) => {
    //console.log("RESPONSE SUCCEEDED.")
    return response
  },
  async (error) => {
    console.log("Response Auth Error.")
    const originalRequest = error?.config

    console.log(error.response)
    console.log(error.message) // Request failed with status code 401, Network Error on 404 response.  Not helpful.
    console.log(error.response.status) // 401 error in loop.  i think this is when the refresh token has expired.
    // maybe redirect to login at that point or raise an error.  need to escape the loop somehow

    if (
      (error.response.status == 401 || error.response.status == 403) &&
      !originalRequest.sent
    ) {
      if (error.response.status == 403) {
        // I THINK THE NORMAL SITUATION IS A 403 ERROR AFTER THE ATOKEN EXPIRES
        console.log("GETTING NEW TOKEN.")
        originalRequest.sent = true

        const newAccessToken = await refreshAccessToken()

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
        return axiosAuth(originalRequest)
      }
    }
    return Promise.reject(error)
  }
)

export { axiosAuth }
