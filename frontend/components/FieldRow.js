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
    const base = useBase();
    const {airtableFields} = useGetAirtableFields();
    const type = form.getFieldValue("fields")[name]?.type;
    const [selectedType, setSelectedType] = useState(type || "");
    const {selectedTable, selectedTemplate} = useContext(AirtableContext);
    const records = useRecords(base.getTableByName(selectedTable));

    const layerOpts = selectedTemplate.layers.flatMap((layer) => {
        return layer.fields.map((field) => ({
            label: `${field.label}.${field.type}`,
            value: `${field.label}.${field.type}`,
            type: field.type,
        }));
    });

    const handleKeyChange = (value = "") => {
        const selectedLayer = layerOpts.find((layer) => layer.value === value);
        setSelectedType(selectedLayer?.type);
        const _fieldValue = form.getFieldValue("fields");
        const fieldValue = _fieldValue.map((field) => {
            if (field.path === value) {
                return {...field, value: []};
            }
            return field;
        });

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
                gap: 10,
            }}
        >
            <FormItem {...restField} name={[name, "path"]} style={{}}>
                <Select
                    options={layerOpts}
                    showSearch
                    onChange={handleKeyChange}
                />
            </FormItem>
            <FormItem {...restField} name={[name, "value"]}>
                <Cascader options={airtableFieldsOpts} showSearch />
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
    flex-grow: 1;
    flex-basis: 0;
    overflow: hidden;
`;
export default FieldRow;
