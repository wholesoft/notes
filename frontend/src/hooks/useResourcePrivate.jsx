import { useState, useEffect } from 'react';
import { useAxiosPrivate } from './useAxiosPrivate';

const useResourcePrivate = resourceUrl => {
    const [resource, setResource] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        (async () => {
            const response = await axiosPrivate.get(resourceUrl);
            setResource(response.data);
        })();
    }, [resourceUrl]);

    return resource;
}

export { useResourcePrivate }