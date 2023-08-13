import {Label} from "./Label";
import {Select} from "antd";
import React, {useEffect} from "react";
import {SyncOutlined} from "@ant-design/icons";
import {useGlobalConfig} from "@airtable/blocks/ui";
import {useGetTemplates} from "../app/queries/template";

function TemplateConfiguration() {
    const globalConfig = useGlobalConfig();
    const apiKey = globalConfig.get("apiKey");
    const selectedTemplate = globalConfig.get("selectedTemplate");
    const {templates = [], refetch, loading} = useGetTemplates();
    const formValue = globalConfig.get("formValue");

    // creating template options
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

        // update global config selected template
        globalConfig.setAsync("selectedTemplate", values);
        globalConfig.setAsync("formValue", null);
    };

    const handleRefresh = async () => {
        let {templates} = await refetch();

        if (!selectedTemplate || !templates) return;

        // finding selected template on refresh
        const _selectedTemplate = templates.find(
            (template) => template._id === selectedTemplate.id
        );

        // preparing fiels from  selected template layer on refresh
        const fields = _selectedTemplate.layers.flatMap((layer) => {
            return layer.fields.map((field) => ({
                path: `${field.label}.${field.type}`,
                type: field.type,
                value: [],
            }));
        });

        // keeping field values as it is if value exist in global settings
        let obj = {...formValue, fields};
        if (formValue) {
            obj.fields = fields.map((field) => {
                const _field = formValue?.fields.find(
                    (storedField) => storedField.path === field.path
                );
                return _field || field;
            });
        }

        globalConfig.setAsync("formValue", obj);
    };

    useEffect(() => {
        apiKey && refetch();
    }, [apiKey]);

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
