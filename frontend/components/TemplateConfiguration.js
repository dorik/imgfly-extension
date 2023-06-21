import React, {useContext, useEffect} from "react";
import {Select} from "antd";
import {useGetTemplates} from "../app/queries/template";
import {AirtableContext} from "../context/AirtableContext";
import {FORM_STATE} from "../const";
import {Label} from "./Label";
import useLocalStorage from "../hooks/useLocalStorage";
import {SyncOutlined} from "@ant-design/icons";

function TemplateConfiguration() {
    const {apiKey, selectedTemplate, handleUpdateState} =
        useContext(AirtableContext);
    const {templates = [], refetch, loading} = useGetTemplates({apiKey});
    const {data, setItem} = useLocalStorage(FORM_STATE);

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

        // update localstate and context with selected template
        handleUpdateState({selectedTemplate: values, formValue: null});
        setItem(FORM_STATE, null);
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

        // keeping field values as it is if value exist in localstorage
        let obj = {...data, fields};
        if (data) {
            obj.fields = fields.map((field) => {
                const _field = data?.fields.find(
                    (storedField) => storedField.path === field.path
                );
                return _field || field;
            });
        }

        // update localstate and context with selected template
        setItem(FORM_STATE, obj);
        handleUpdateState({formValue: obj});
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
