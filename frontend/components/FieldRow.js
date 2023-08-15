import React, {useState} from "react";
import styled from "styled-components";
import {Form, Select, Cascader} from "antd";
import {MinusCircleOutlined} from "@ant-design/icons";
import useGetAirtableFields from "../hooks/useGetAirtableFields";
import {getAirtableFieldOpts} from "../utils/getAirtableFieldOpts";
import {useBase, useGlobalConfig, useRecords} from "@airtable/blocks/ui";

function FieldRow({remove, name, form, ...restField}) {
    const base = useBase();
    const {airtableFields} = useGetAirtableFields();
    const type = form.getFieldValue("fields")[name]?.type;
    const [selectedType, setSelectedType] = useState(type || "");

    const globalConfig = useGlobalConfig();
    const selectedTable = globalConfig.get("selectedTable");
    const selectedTemplate = globalConfig.get("selectedTemplate");
    const records =
        useRecords(base.getTableByNameIfExists(selectedTable)) || [];

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
            <FormItem {...restField} name={[name, "path"]}>
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
