import React, {useMemo} from "react";
import styled from "styled-components";
import {PlusOutlined} from "@ant-design/icons";
import {Button, Form, Select} from "antd";
import {useContext} from "react";
import {AirtableContext} from "../context/AirtableContext";
import FieldRow from "./FieldRow";
import {useEffect} from "react";
import {generatePayload} from "../utils/generatePayload";
import {useBase} from "@airtable/blocks/ui";
import useGetAirtableFields from "../hooks/useGetAirtableFields";
import {FORM_STATE, SHOULD_UPDATE} from "../const";
import {getFormatedValue} from "../utils/getFormatedValue";
import {useState} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import {Label} from "./Label";
const updateTypeOpts = [
    {label: "Update as Image", value: "image"},
    {label: "Update as URL", value: "url"},
];

const DynamicForm = () => {
    const {selectedTable, selectedTemplate} = useContext(AirtableContext);
    const {data: initialValue, setItem} = useLocalStorage(FORM_STATE);

    const {airtableFields} = useGetAirtableFields();
    const [form] = Form.useForm();
    const base = useBase();
    const [updateType, setUpdateType] = useState("image");
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        const {outputField, updateType, fields} = values;
        const table = base.getTable(selectedTable);
        const records = await table.selectRecordsAsync();
        setItem(FORM_STATE, values);

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

    useEffect(() => {
        if (initialValue) {
            return form.setFieldsValue(initialValue);
        }
        if (selectedTemplate.layers) {
            const fields = selectedTemplate.layers.flatMap((layer) => {
                return layer.fields.map((field) => ({
                    path: `${field.label}.${field.type}`,
                    type: field.type,
                    value: [],
                }));
            });

            form.setFieldsValue({fields, outputField: ""});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [airtableFields, initialValue, selectedTemplate]);

    const _fields = useMemo(() => {
        const types = {
            image: ["multipleAttachments"],
            url: ["multilineText", "singleLineText"],
        }[updateType || "url"];

        return airtableFields.filter((field) => types.includes(field.type));
    }, [airtableFields, updateType]);

    const handleValueChange = ({updateType}) => {
        if (updateType) {
            setUpdateType(updateType);
        }
    };

    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            onValuesChange={handleValueChange}
        >
            <FormItem label="Dynamic Properties">
                <Form.List name="fields" style={{width: "100%"}}>
                    {(fields = [], {add, remove}) => (
                        <>
                            {fields.map((field, idx) => {
                                return (
                                    <FieldRow
                                        form={form}
                                        key={idx}
                                        remove={remove}
                                        {...field}
                                    />
                                );
                            })}
                            <FormItem>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add field
                                </Button>
                            </FormItem>
                        </>
                    )}
                </Form.List>

                <FormItem name="updateType" label="Update Type">
                    <Select options={updateTypeOpts} />
                </FormItem>

                <FormItem name="outputField" label="Output Field">
                    <Select options={_fields} />
                </FormItem>
            </FormItem>
            <FormItem>
                <Button loading={loading} type="primary" htmlType="submit">
                    Submit
                </Button>
            </FormItem>
        </Form>
    );
};

const FormItem = styled(Form.Item)`
    margin-bottom: 10px;
    label {
        font-weight: 600;
    }
`;
export default DynamicForm;
