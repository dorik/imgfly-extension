import {useBase} from "@airtable/blocks/ui";
import React from "react";
import {useContext} from "react";
import {AirtableContext} from "../context/AirtableContext";

function useGetAirtableFields() {
    const base = useBase();
    const {selectedTable} = useContext(AirtableContext);
    const table = base.getTableByName(selectedTable);

    const airtableFields = table?.fields.map((field) => {
        return {
            label: field.name,
            value: field.name,
            type: field.type,
        };
    });
    return {airtableFields: airtableFields || []};
}

export default useGetAirtableFields;
