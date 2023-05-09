import axios from "axios";
import {useState, useEffect} from "react";

const getTemplates = async (cb) => {
    cb({loading: true});
    const {data} = await axios.get("https://imgfly.dorik.dev/api/v1/templates");
    if (data) {
        cb({...data, loading: false});
        return data;
    }
};

export const useGetTemplates = () => {
    const [state, setState] = useState({loading: false});
    const refetch = () => getTemplates(setState);

    useEffect(() => {
        getTemplates(setState);
    }, []);
    return {...state, refetch};
};
