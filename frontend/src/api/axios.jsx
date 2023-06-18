import axios from "axios"

let BASE_URL = "https://notes-api.wholesoft.net"

if (process.env.NODE_ENV == "development") {
  BASE_URL = "http://192.168.8.2:3001"
}
//const { auth } = useContext(AuthContext);

export default axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

export const refreshAccessTokenFn = async () => {
  //const response = await authApi.get(); // <ILoginResponse>('auth/refresh');
  const response = await authApi.get("/refresh", { withCredentials: true })
  console.log("REFRESH AUTH TOKEN: " + JSON.stringify(response.data))
  /*
    {"access_token":"...",
    "email":"...",
    "roles":[]}
    */
  // response.data.access_token

  //return response.data;
  localStorage.setItem("atoken", response.data.access_token)
  return response.data.access_token
}

/*
  authApi.interceptors.request.use(
    config => {
      
        if (!config.headers['Authorization']) {
            const atoken = localStorage.getItem('atoken')
            console.log("Access Token: " + atoken);
            config.headers['Authorization'] = `Bearer ${atoken}`;
        }
        return config;
    }, (error) => {
        //console.log("Request Auth Error.");
        Promise.reject(error)
    })
*/

authApi.interceptors.response.use(
  (response) => {
    console.log("interceptor fired")
    return response
  },
  async (error) => {
    // We get a 401 error when a valid JWT token is needed
    console.log("interceptor error")
    console.log(error.message) // Request failed with status code 401
    console.log(error.response.status) // 401
    const originalRequest = error.config
    //const errMessage = error.response.data.message; //undefine? // as string

    //console.log(errMessage);
    if (
      (error.response.status == 401 || error.response.statue == 403) &&
      !originalRequest._retry
    ) {
      console.log("Request refresh token.")
      originalRequest._retry = true
      //await refreshAccessTokenFn();
      const newAccessToken = await refreshAccessTokenFn()
      //const newAccessToken = await refresh();
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
      return authApi(originalRequest)
    }
    return Promise.reject(error)
  }
)
