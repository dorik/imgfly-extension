import React from "react";
import {Select} from "antd";
import {Label} from "./Label";
import {useBase, useGlobalConfig} from "@airtable/blocks/ui";

function AirtableConfiguration() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const selectedTable = globalConfig.get("selectedTable");

    const handleSelectTable = async (value) => {
        await globalConfig.setAsync("selectedTable", value);
        await globalConfig.setAsync("outputField", "");
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
