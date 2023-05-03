import React, {createContext, useState, useEffect} from "react";
import {CONTEXT_STATE} from "../const";
export const AirtableContext = React.createContext();
export const AirtableContextProvider = ({children}) => {
    const [state, setState] = useState();

    const handleUpdateState = (value) => {
        setState((prev) => ({...prev, ...value}));
    };

    useEffect(() => {
        const storedValue = localStorage.getItem(CONTEXT_STATE);
        if (storedValue) {
            setState(JSON.parse(storedValue));
        }
    }, []);

    useEffect(() => {
        state && localStorage.setItem(CONTEXT_STATE, JSON.stringify(state));
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
