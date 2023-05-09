import {useBase} from "@airtable/blocks/ui";
import {useContext, useState} from "react";
import {AirtableContext} from "../context/AirtableContext";
import useLocalStorage from "./useLocalStorage";
import {FORM_STATE, SHOULD_UPDATE} from "../const";
import {getFormatedValue} from "../utils/getFormatedValue";
import {generatePayload} from "../utils/generatePayload";

function useUpdateAirtableBase() {
    const {selectedTable, selectedTemplate, handleUpdateState} =
        useContext(AirtableContext);
    const {setItem} = useLocalStorage();
    const [loading, setLoading] = useState(false);
    const base = useBase();

    const updateRecords = async ({values}) => {
        setLoading(true);
        const {outputField, updateType, fields} = values;
        const table = base.getTable(selectedTable);
        const records = await table.selectRecordsAsync();
        setItem(FORM_STATE, values);
        handleUpdateState({formValue: values});

        if (outputField) {
            let result = records.records
                .map((record) => {
                    const shouldUpdate = record.getCellValue(SHOULD_UPDATE);
                    if (shouldUpdate) {
                        const res = getFormatedValue(record, fields);
                        const payload = generatePayload(res);
                        let imgPath = `https://imgfly.dorik.dev/t/${selectedTemplate.id}?${payload}`;
                        let updateValue = imgPath;

                        if (updateType === "image") {
                            updateValue = [
                                {
                                    url: imgPath,
                                    filename: `${selectedTemplate.name}.png`,
                                },
                            ];
                        }
                        return {
                            id: record.id,
                            fields: {
                                [outputField]: updateValue,
                            },
                        };
                    }
                })
                .filter((v) => v);
            await table.updateRecordsAsync(result);
            setLoading(false);
        }
    };
    return {updateRecords, loading};
}

export default useUpdateAirtableBase;
