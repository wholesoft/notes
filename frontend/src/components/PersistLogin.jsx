import * as React from 'react';
import { Outlet } from "react-router-dom";
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'


const PersistLogin = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();
    const effectRan = React.useRef(false);

    
    React.useEffect(() => {
        //let isMounted = true;
        if (effectRan.current === false)
        {
            //console.log("Persist Login -> useEffect");

            //console.log("call verifyRefreshToken");
            const verifyRefreshToken = async () => {
                try {
                    await refresh();
                }
                catch (err) {
                    console.error(err)
                }
                finally {
                    setIsLoading(false);
                }
            }
            !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);
            
        }
        // cleanup function
        return () => {
        effectRan.current = true;  
        //isMounted = false;
    }
    }, [])

    React.useEffect(() => {
        //console.log(`isLoading: ${isLoading}`)
        //console.log(`auth-token: ${JSON.stringify(auth)}`)
    }, [isLoading])

    return (
        <>
        {!persist
          ? <Outlet />
          : isLoading 
            ? <p>Loading...</p>
            : <Outlet />
        }
        </>
    )
        }
    export { PersistLogin }
