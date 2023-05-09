import React, {useContext} from "react";
import {Select} from "antd";
import {useGetTemplates} from "../app/queries/template";
import {AirtableContext} from "../context/AirtableContext";
import {FORM_STATE} from "../const";
import {Label} from "./Label";
import useLocalStorage from "../hooks/useLocalStorage";
import {SyncOutlined} from "@ant-design/icons";

function TemplateConfiguration() {
    const {templates = [], refetch, loading} = useGetTemplates();
    const {data, setItem} = useLocalStorage(FORM_STATE);
    const {apiKey, selectedTemplate, handleUpdateState} =
        useContext(AirtableContext);
    const tamplateOpts = templates.map((template) => ({
        label: template.name,
        value: template._id,
    }));

    const selectTemplate = (value) => {
        let values = {};
        const selectedTemplate = templates.find(
            (template) => template._id === value
        );

        if (selectedTemplate) {
            values.id = selectedTemplate._id;
            values.name = selectedTemplate.name;
            values.layers = selectedTemplate.layers;
        }
        handleUpdateState({selectedTemplate: values, formValue: null});
        setItem(FORM_STATE, null);
    };

    const handleRefresh = async () => {
        let {templates} = await refetch();

        const _selectedTemplate = templates.find(
            (template) => template._id === selectedTemplate.id
        );

        const _fields = _selectedTemplate.layers.flatMap((layer) => {
            return layer.fields.map((field) => ({
                path: `${field.label}.${field.type}`,
                type: field.type,
                value: [],
            }));
        });

        if (data) {
            let fields = _fields.map((field) => {
                const _field = data?.fields.find(
                    (storedField) => storedField.path === field.path
                );
                if (_field) {
                    return _field;
                } else {
                    return field;
                }
            });

            setItem(FORM_STATE, {...data, fields});
            handleUpdateState({formValue: {...data, fields}});
        }
    };

    return (
        <>
            <Label>
                Select Template
                <SyncOutlined
                    onClick={handleRefresh}
                    className="refresh-icon"
                    spin={loading}
                />
            </Label>
            <Select
                allowClear
                options={tamplateOpts}
                value={selectedTemplate?.id}
                onChange={(value) => selectTemplate(value)}
                style={{width: "100%", marginTop: 5, marginBottom: 10}}
            />
        </>
    );
}

export default TemplateConfiguration;
