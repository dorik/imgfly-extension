import React, {useContext} from "react";
import styled from "styled-components";
import {initializeBlock} from "@airtable/blocks/ui";
import {
    AirtableContext,
    AirtableContextProvider,
} from "./context/AirtableContext";

const Wrapper = styled.div`
    padding: 20px;
`;
const App = () => {
    const {selectedTable} = useContext(AirtableContext);
    console.log("billal", {selectedTable});

    return <Wrapper>hello</Wrapper>;
};

initializeBlock(() => (
    <AirtableContextProvider>
        <App />
    </AirtableContextProvider>
));
