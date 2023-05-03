import axios from "axios";
import {useState, useEffect} from "react";

export const useGetTemplates = () => {
    const [state, setState] = useState({});
    useEffect(() => {
        axios.get("https://imgfly.dorik.dev/api/v1/templates").then((res) => {
            setState(res.data);
        });
    }, []);
    return state;
};
