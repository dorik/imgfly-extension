import React, {createContext, useState, useEffect} from "react";
export const AirtableContext = createContext();
import {useBase} from "@airtable/blocks/ui";

export const AirtableContextProvider = ({children, value}) => {
    const [state, setstate] = useState();
    const base = useBase();

    const handleSelectTable = (value) => {
        setstate((prev) => ({
            ...prev,
            selectedTable: value,
            selectedField: "",
        }));
    };
    const handleSelectField = (value) => {
        setstate((prev) => ({...prev, selectedField: value}));
    };

    useEffect(() => {
        if (state?.selectedTable) {
            const table = base.getTableByName(state.selectedTable);

            const airtableFields = table.fields.map((field) => {
                console.log("billal", {field});

                return {
                    label: field.name,
                    value: field.name,
                    type: field.type,
                };
            });

            setstate((prev) => ({...prev, airtableFields}));
        }
    }, [base, state?.selectedTable]);

    useEffect(() => {
        state && localStorage.setItem("_state", JSON.stringify(state));
    }, [state]);

    useEffect(() => {
        const storedValue = localStorage.getItem("_state");
        if (storedValue) {
            setstate(JSON.parse(storedValue));
        }
    }, []);

    const ctx = {
        base,
        ...state,
        handleSelectTable,
        handleSelectField,
    };

    return (
        <AirtableContext.Provider value={{...value, ...ctx}}>
            {children}
        </AirtableContext.Provider>
    );
};
