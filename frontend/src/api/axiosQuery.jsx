/* 
Needs to return a Promise
*/
import { authApi } from "../api/axios";


const axiosGet = async (url) => { 
    console.log("axiosGet");
    const request = authApi.get(url)
    return request
}

export { axiosGet }