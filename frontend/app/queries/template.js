import axios from "axios";
import {useState, useEffect} from "react";

const getTemplates = async (apiKey, cb) => {
    cb({loading: true});
    const response = await axios
        .get("https://imgfly.ashik.dev/api/v1/templates", {
            headers: {
                "x-imgfly-api-key": apiKey,
            },
        })
        .catch((err) => console.log({err}));

    if (response?.data) {
        cb({...response.data, loading: false});
        return response.data;
    }
    cb({templates: [], loading: false});
    return {};
};

export const useGetTemplates = ({apiKey}) => {
    const [state, setState] = useState({loading: false});
    const refetch = () => getTemplates(apiKey, setState);

    useEffect(() => {
        getTemplates(apiKey, setState);
    }, []);
    return {...state, refetch};
};
