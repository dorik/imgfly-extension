import React, {useContext} from "react";
import styled from "styled-components";
import {initializeBlock} from "@airtable/blocks/ui";
import AirtableConfiguration from "./components/AirtableConfiguration";
import {
    AirtableContext,
    AirtableContextProvider,
} from "./context/AirtableContext";

const Wrapper = styled.div`
    padding: 20px;
`;
const App = () => {
    const {selectedTable} = useContext(AirtableContext);

    return (
        <Wrapper>
            <AirtableConfiguration />
        </Wrapper>
    );
};

initializeBlock(() => (
    <AirtableContextProvider>
        <App />
    </AirtableContextProvider>
));
