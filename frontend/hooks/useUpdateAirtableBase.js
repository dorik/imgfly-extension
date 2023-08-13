import {useState} from "react";
import {SHOULD_UPDATE, API_URL} from "../const";
import {generatePayload} from "../utils/generatePayload";
import {getFormatedValue} from "../utils/getFormatedValue";
import {useBase, useGlobalConfig} from "@airtable/blocks/ui";
import {notification} from "antd";

function useUpdateAirtableBase() {
    const globalConfig = useGlobalConfig();
    const selectedTable = globalConfig.get("selectedTable");
    const selectedTemplate = globalConfig.get("selectedTemplate");
    const [loading, setLoading] = useState(false);
    const base = useBase();

    const updateRecords = async ({values}) => {
        setLoading(true);
        const {outputField, updateType, fields} = values;
        const table = base.getTable(selectedTable);
        const records = await table.selectRecordsAsync();
        globalConfig.setAsync("formValue", values);
        let outputFieldExist = table.getFieldIfExists(outputField);

        try {
            let result = records.records
                .map((record) => {
                    const shouldUpdate = record.getCellValue(SHOULD_UPDATE);

                    if (shouldUpdate) {
                        if (!outputFieldExist) {
                            throw new Error(
                                "Please add your output fields to the table"
                            );
                        }

                        const res = getFormatedValue(record, fields);
                        const payload = generatePayload(res);
                        let imgPath =
                            API_URL + `/t/${selectedTemplate.id}?${payload}`;

                        let updateValue = imgPath;
                        if (updateType === "image") {
                            updateValue = [
                                {
                                    url: imgPath,
                                    filename: `${selectedTemplate?.name}.png`,
                                },
                            ];
                        }

                        const checkResult =
                            table.checkPermissionsForUpdateRecord(record, {
                                [outputField]: updateValue,
                            });

                        if (!checkResult.hasPermission) {
                            throw new Error(
                                "You are not allowed to update the selected output field"
                            );
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
            notification.success({
                placement: "bottomRight",
                message: "Table successfully Updated",
            });
        } catch (error) {
            setLoading(false);
            notification.error({
                placement: "bottomRight",
                message: error.message,
            });
        }
    };
    return {updateRecords, loading};
}

export default useUpdateAirtableBase;
