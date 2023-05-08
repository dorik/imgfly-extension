import React, {createContext, useState, useEffect} from "react";
import {CONTEXT_STATE} from "../const";
import useLocalStorage from "../hooks/useLocalStorage";
export const AirtableContext = createContext();
export const AirtableContextProvider = ({children}) => {
    const {getItem, setItem} = useLocalStorage();
    const [state, setState] = useState();

    const handleUpdateState = (value) => {
        setState((prev) => ({...prev, ...value}));
    };

    useEffect(() => {
        const storedValue = getItem(CONTEXT_STATE);
        if (storedValue) {
            setState(storedValue);
        }
    }, []);

    useEffect(() => {
        state && setItem(CONTEXT_STATE, state);
    }, [state]);

    const ctx = {
        ...state,
        handleUpdateState,
    };

    return (
        <AirtableContext.Provider value={ctx}>
            {children}
        </AirtableContext.Provider>
    );
};
