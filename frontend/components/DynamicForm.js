import FieldRow from "./FieldRow";
import styled from "styled-components";
import {Button, Form, Select} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import React, {useState, useEffect} from "react";
import {useGlobalConfig} from "@airtable/blocks/ui";
import useGetAirtableFields from "../hooks/useGetAirtableFields";
import useUpdateAirtableBase from "../hooks/useUpdateAirtableBase";
import {getSelectedFieldTypeOpts} from "../utils/getSelectedFieldTypeOpts";

const updateTypeOpts = [
    {label: "Update as Image", value: "image"},
    {label: "Update as URL", value: "url"},
];

const DynamicForm = () => {
    const {airtableFields} = useGetAirtableFields();
    const {loading, updateRecords} = useUpdateAirtableBase();
    const [outputFieldOpts, setOutputFieldOpts] = useState([]);

    const globalConfig = useGlobalConfig();
    const formValue = globalConfig.get("formValue");
    const selectedTable = globalConfig.get("selectedTable");
    const selectedTemplate = globalConfig.get("selectedTemplate");

    const [form] = Form.useForm();
    const onFinish = async (values) => {
        await updateRecords({values});
    };

    const handleValueChange = ({updateType}) => {
        if (updateType) {
            form.setFieldValue("outputField");
            let fields = getSelectedFieldTypeOpts({updateType, airtableFields});
            setOutputFieldOpts(fields);
        }
    };

    useEffect(() => {
        // preparing fiels from  selected template layer
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
    }, [form, selectedTemplate]);

    useEffect(() => {
        if (formValue) {
            form.setFieldsValue(formValue);
        }
    }, [form, formValue]);

    useEffect(() => {
        const updateType = form.getFieldValue("updateType");
        let fields = getSelectedFieldTypeOpts({
            updateType: updateType || "image",
            airtableFields,
        });
        setOutputFieldOpts(fields);
    }, [selectedTable]);

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

                <FormItem
                    rules={[
                        {required: true, message: "Please Select UpdateType"},
                    ]}
                    name="updateType"
                    label="Update Type"
                >
                    <Select options={updateTypeOpts} />
                </FormItem>

                <FormItem
                    rules={[
                        {required: true, message: "Please Select Output Field"},
                    ]}
                    name="outputField"
                    label="Output Field"
                >
                    <Select options={outputFieldOpts} />
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
