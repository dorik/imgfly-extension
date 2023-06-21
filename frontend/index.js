import React, {useContext} from "react";
import styled from "styled-components";
import {initializeBlock} from "@airtable/blocks/ui";
import DynamicForm from "./components/DynamicForm";
import AirtableConfiguration from "./components/AirtableConfiguration";
import TemplateConfiguration from "./components/TemplateConfiguration";
import {
    AirtableContext,
    AirtableContextProvider,
} from "./context/AirtableContext";
import APIKey from "./components/APIKey";

const Wrapper = styled.div`
    padding: 20px;
`;
const Configurations = () => {
    const {apiKey, selectedTable, selectedTemplate} =
        useContext(AirtableContext);
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

const AppComp = (props) => {
    return (
        <AirtableContextProvider>
            <Wrapper>
                <APIKey />
                <Configurations />
            </Wrapper>
        </AirtableContextProvider>
    );
};
initializeBlock(AppComp);
