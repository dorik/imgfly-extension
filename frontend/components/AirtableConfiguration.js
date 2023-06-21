import React, {useContext} from "react";
import {Select} from "antd";
import {AirtableContext} from "../context/AirtableContext";
import {useBase} from "@airtable/blocks/ui";
import {Label} from "./Label";

function AirtableConfiguration() {
    const {selectedTable, handleUpdateState} = useContext(AirtableContext);
    const base = useBase();

    const handleSelectTable = (value) => {
        handleUpdateState({selectedTable: value, outputField: ""});
    };

    const tableOptions =
        base.tables.map((table) => ({
            value: table.name,
            label: table.name,
        })) || [];

    return (
        <>
            <Label>Table</Label>
            <Select
                options={tableOptions}
                value={selectedTable}
                onChange={handleSelectTable}
                style={{width: "100%", marginTop: 5, marginBottom: 10}}
            />
        </>
    );
}

export default AirtableConfiguration;
