import React from "react";
import styled from "styled-components";
import APIKey from "./components/APIKey";
import DynamicForm from "./components/DynamicForm";
import {initializeBlock, useGlobalConfig} from "@airtable/blocks/ui";
import AirtableConfiguration from "./components/AirtableConfiguration";
import TemplateConfiguration from "./components/TemplateConfiguration";

const Wrapper = styled.div`
    padding: 20px;
`;

const Configurations = () => {
    const globalConfig = useGlobalConfig();
    const apiKey = globalConfig.get("apiKey");
    const selectedTemplate = globalConfig.get("selectedTemplate");
    const selectedTable = globalConfig.get("selectedTable");
    const enableForm = selectedTable && selectedTemplate?.id;

    if (!apiKey) return null;

    return (
        <>
            <TemplateConfiguration />
            <AirtableConfiguration />
            {enableForm && <DynamicForm />}
        </>
    );
};

const AppComp = () => {
    return (
        <Wrapper>
            <APIKey />
            <Configurations />
        </Wrapper>
    );
};
initializeBlock(AppComp);
