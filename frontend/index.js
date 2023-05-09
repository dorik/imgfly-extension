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
const App = () => {
    const {apiKey, selectedTable, selectedTemplate} =
        useContext(AirtableContext);
    const enableForm = selectedTable && selectedTemplate?.id;

    return (
        <Wrapper>
            <APIKey />
            {apiKey ? (
                <React.Fragment>
                    <TemplateConfiguration />
                    <AirtableConfiguration />
                    {enableForm && <DynamicForm />}
                </React.Fragment>
            ) : null}
        </Wrapper>
    );
};

const AppComp = (props) => {
    return (
        <AirtableContextProvider>
            <App {...props} />
        </AirtableContextProvider>
    );
};
initializeBlock(AppComp);
