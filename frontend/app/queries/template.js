import {useGlobalConfig} from "@airtable/blocks/ui";
import axios from "axios";
import {useState, useEffect} from "react";
import {API_URL} from "../../const";

const getTemplates = async (apiKey, cb) => {
    cb({loading: true});
    const response = await axios
        .get(API_URL + "/api/v1/templates", {
            headers: {
                "x-imgfly-api-key": apiKey,
                "Content-Type": "application/json",
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

export const useGetTemplates = () => {
    const globalConfig = useGlobalConfig();
    const apiKey = globalConfig.get("apiKey");
    const [state, setState] = useState({loading: false});
    const refetch = () => getTemplates(apiKey, setState);

    useEffect(() => {
        getTemplates(apiKey, setState);
    }, []);
    return {...state, refetch};
};
