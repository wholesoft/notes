import { axiosPrivate } from "../api/axios";
import { useEffect, useRef } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";


const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
   // const effectRan = useRef(false);

    useEffect(() => {
            const requestIntercept = axiosPrivate.interceptors.request.use(
                config => {
                    if (!config.headers['Authorization']) {
                        config.headers['Authorization'] = `Bearer ${auth?.access_token}`;
                    }
                    return config;
                }, (error) => {
                    //console.log("Request Auth Error.");
                    Promise.reject(error)
                }  
            );

            const responseIntercept = axiosPrivate.interceptors.response.use(
                response => response,
                async (error) => {  
                    console.log("Response Auth Error.");
                    const prevRequest = error?.config;
                    if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent) {
                        console.log("GETTING NEW TOKEN.");
                        prevRequest.sent = true; 
                        const newAccessToken = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    }
                    return Promise.reject(error);
                }
            );
            
            
            return () => {
                axiosPrivate.interceptors.request.eject(requestIntercept);
                axiosPrivate.interceptors.response.eject(responseIntercept);
                //console.log("Clean up use axios private.");
                //effectRan.current = false;
            }
    }, [auth, refresh])
    return axiosPrivate;
}

export { useAxiosPrivate }