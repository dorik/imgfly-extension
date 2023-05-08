import axios from "axios";
import {useState, useEffect} from "react";

const getTemplates = (cb) => {
    cb({loading: true});
    axios.get("https://imgfly.dorik.dev/api/v1/templates").then((res) => {
        cb({...res.data, loading: false});
    });
};

export const useGetTemplates = () => {
    const [state, setState] = useState({loading: false});
    const refetch = () => getTemplates(setState);

    useEffect(() => {
        getTemplates(setState);
    }, []);
    return {...state, refetch};
};
