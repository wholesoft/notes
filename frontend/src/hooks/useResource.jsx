import { useState, useEffect } from 'react';
import axios from '../api/axios'

const useResource = resourceUrl => {
    const [resource, setResource] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await axios.get(resourceUrl);
            setResource(response.data);
        })();
    }, [resourceUrl]);

    return resource;
}

export { useResource }