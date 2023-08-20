import React, {useState} from "react";
import {SHOULD_UPDATE} from "../const";
import {generatePayload} from "../utils/generatePayload";
import {getFormatedValue} from "../utils/getFormatedValue";
import {useBase, useGlobalConfig} from "@airtable/blocks/ui";
import {notification} from "antd";
import {createImg} from "../app/queries/image";

function useUpdateAirtableBase() {
    const globalConfig = useGlobalConfig();
    const apiKey = globalConfig.get("apiKey");
    const selectedTable = globalConfig.get("selectedTable");
    const selectedTemplate = globalConfig.get("selectedTemplate");
    const [loading, setLoading] = useState(false);
    const base = useBase();

    const updateRecords = async ({values}) => {
        setLoading(true);
        const {outputField, updateType, fields} = values;
        const table = base.getTableByNameIfExists(selectedTable);

        globalConfig.setAsync("formValue", values);

        try {
            if (!table) {
                throw new Error("Table doesn't exist");
            }
            let outputFieldExist = table.getFieldIfExists(outputField);
            if (!outputFieldExist) {
                throw new Error("Please add your output fields to the table");
            }
            if (table.getFieldIfExists(SHOULD_UPDATE)?.type !== "checkbox") {
                throw new Error(
                    "Please add a checkbox field named as shouldUpdate to the table"
                );
            }

            const data = await table.selectRecordsAsync();
            const result = [];
            const filteredItem = data.records.filter((record) => {
                return record.getCellValue(SHOULD_UPDATE);
            });
            for (const record of filteredItem) {
                try {
                    const res = getFormatedValue(record, fields);
                    const payload = generatePayload(res, selectedTemplate?.id);
                    let data = await createImg({apiKey, payload});
                    if (data?.status !== 201) {
                        throw new Error(data?.message);
                    }

                    let updateValue = data?.imgURL;
                    if (updateType === "image") {
                        updateValue = [
                            {
                                url: data?.imgURL,
                                filename: `${selectedTemplate?.name}.png`,
                            },
                        ];
                    }

                    const checkResult = table.checkPermissionsForUpdateRecord(
                        record,
                        {
                            [outputField]: updateValue,
                        }
                    );

                    if (!checkResult.hasPermission) {
                        throw new Error(
                            "You are not allowed to update the selected output field"
                        );
                    }
                    if (data?.imgURL) {
                        await table.updateRecordAsync(record.id, {
                            [outputField]: updateValue,
                        });
                        result.push({
                            status: "fulfilled",
                            message: "table successfully updated",
                        });
                    }
                } catch (error) {
                    result.push({
                        status: "rejected",
                        message: error.message,
                    });
                }
            }

            const successItems = result.filter(
                (item) => item.status === "fulfilled"
            );
            const rejectedItems = result.filter(
                (item) => item.status === "rejected"
            );

            const errorMsgs = [
                ...new Set(rejectedItems.map((item) => item?.message)),
            ];
            const successMsg =
                successItems.length &&
                `${successItems.length} field updated successfully`;

            const ErrorMessage = () => {
                return (
                    <div>
                        {errorMsgs.length} field failed to update due to:
                        <ul style={{margin: 0, paddingLeft: 20}}>
                            {errorMsgs.map((item) => (
                                <li>{item}</li>
                            ))}
                        </ul>
                    </div>
                );
            };

            setLoading(false);

            // render error messages if action fail
            errorMsgs.length &&
                notification.error({
                    placement: "bottomRight",
                    message: <ErrorMessage />,
                });

            // render success messages when action is success
            setTimeout(
                () =>
                    successMsg &&
                    notification.success({
                        placement: "bottomRight",
                        message: successMsg,
                    }),
                100
            );
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
