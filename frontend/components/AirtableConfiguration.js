import React, {useContext} from "react";
import {Select} from "antd";
import {AirtableContext} from "../context/AirtableContext";

function AirtableConfiguration() {
    const {
        base,
        airtableFields = [],
        selectedField,
        selectedTable,
        handleSelectTable,
        handleSelectField,
    } = useContext(AirtableContext);

    const tableOptions =
        base.tables.map((table) => ({
            value: table.name,
            label: table.name,
        })) || [];

    const fields = airtableFields.filter(
        (field) => field.type === "singleLineText"
    );

    return (
        <div>
            <strong>Table</strong>
            <Select
                options={tableOptions}
                value={selectedTable}
                onChange={(value) => handleSelectTable(value)}
                style={{width: "100%", marginTop: 5, marginBottom: 10}}
            />
            {selectedTable && (
                <>
                    <strong>Output Field</strong>
                    <Select
                        options={fields}
                        value={selectedField}
                        onChange={(value) => handleSelectField(value)}
                        style={{width: "100%", marginTop: 5, marginBottom: 10}}
                    />
                </>
            )}
        </div>
    );
}

export default AirtableConfiguration;
