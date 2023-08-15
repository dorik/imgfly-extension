import {useBase, useGlobalConfig} from "@airtable/blocks/ui";

function useGetAirtableFields() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const selectedTable = globalConfig.get("selectedTable");
    const table = base.getTableByNameIfExists(selectedTable);

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
