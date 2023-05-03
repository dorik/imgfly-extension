import React from "react";
import styled from "styled-components";
import {MinusCircleOutlined} from "@ant-design/icons";
import {Form, Select, Cascader} from "antd";
import {useState} from "react";
import {useContext} from "react";
import {AirtableContext} from "../context/AirtableContext";
import {useBase, useRecords} from "@airtable/blocks/ui";
import {getAirtableFieldOpts} from "../utils/getAirtableFieldOpts";
import useGetAirtableFields from "../hooks/useGetAirtableFields";

const layerStr = [
    {id: "Text_1", dynamicField: ["text", "color"]},
    {id: "Text_2", dynamicField: ["text"]},
    {id: "Image_3", dynamicField: ["src"]},
    {id: "Rect_1", dynamicField: ["color"]},
];

const layerOpts = layerStr.flatMap((layer) => {
    return layer.dynamicField.map((field) => {
        return {
            label: `${layer.id}.${field}`,
            value: `${layer.id}.${field}`,
        };
    });
});

function FieldRow({remove, name, form, ...restField}) {
    const type = form.getFieldValue("fields")[name]?.type;

    const [selectedType, setSelectedType] = useState(type || "");

    const {selectedTable, selectedTemplate} = useContext(AirtableContext);
    const base = useBase();
    const {airtableFields} = useGetAirtableFields();
    const records = useRecords(base.getTableByName(selectedTable));

    const layerOpts = selectedTemplate.layers.flatMap((layer) => {
        return layer.fields.map((field) => ({
            label: `${field.label}.${field.type}`,
            value: `${field.label}.${field.type}`,
        }));
    });

    const handleKeyChange = (value = "") => {
        const [_, type] = value.split(".");

        setSelectedType(type);
        const fieldValue = form.getFieldValue("fields");
        fieldValue[restField.fieldKey] = {
            ...fieldValue[restField.fieldKey],
            value: [],
        };

        form.setFieldValue("fields", fieldValue);
    };

    const airtableFieldsOpts = getAirtableFieldOpts(
        airtableFields,
        selectedType,
        records[0]
    );

    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                gap: "5px",
                alignItem: "baseline",
            }}
        >
            <FormItem
                {...restField}
                name={[name, "path"]}
                style={{width: "100%"}}
            >
                <Select
                    options={layerOpts}
                    showSearch
                    onChange={handleKeyChange}
                />
            </FormItem>
            <FormItem
                {...restField}
                style={{width: "100%"}}
                name={[name, "value"]}
            >
                <Cascader
                    style={{width: "100%", height: "100% !important"}}
                    options={airtableFieldsOpts}
                    showSearch
                />
            </FormItem>
            <MinusCircleOutlined
                style={{maxWidth: 30}}
                onClick={() => remove(name)}
            />
        </div>
    );
}

const FormItem = styled(Form.Item)`
    margin-bottom: 10px;
`;
export default FieldRow;
