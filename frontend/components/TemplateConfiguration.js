import React from "react";
import {Select} from "antd";
import {useGetTemplates} from "../app/queries/template";
import {useContext} from "react";
import {AirtableContext} from "../context/AirtableContext";
import {FORM_STATE} from "../const";
import {Label} from "./Label";
import useLocalStorage from "../hooks/useLocalStorage";
import {SyncOutlined} from "@ant-design/icons";

function TemplateConfiguration() {
    const {templates = [], refetch, loading} = useGetTemplates();
    const {data, setItem} = useLocalStorage(FORM_STATE);
    const {selectedTemplate, handleUpdateState} = useContext(AirtableContext);
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
        handleUpdateState({selectedTemplate: values});
        setItem(FORM_STATE, null);
    };

    const handleRefresh = () => {
        refetch();
        const _selectedTemplate = templates.find(
            (template) => template._id === selectedTemplate.id
        );

        const fields = _selectedTemplate.layers.flatMap((layer) => {
            return layer.fields.map((field) => ({
                path: `${field.label}.${field.type}`,
                type: field.type,
                value: [],
            }));
        });
        setItem(FORM_STATE, {...data, fields});
    };

    return (
        <div>
            <Label>
                Select Template{" "}
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
        </div>
    );
}

export default TemplateConfiguration;
