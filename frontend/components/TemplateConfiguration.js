import React from "react";
import {Select} from "antd";
import {useGetTemplates} from "../app/queries/template";
import {useContext} from "react";
import {AirtableContext} from "../context/AirtableContext";
import {FORM_STATE} from "../const";

function TemplateConfiguration() {
    const {templates = []} = useGetTemplates();
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
        localStorage.setItem(FORM_STATE, null);
    };

    return (
        <div>
            <strong>Select Template</strong>
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
