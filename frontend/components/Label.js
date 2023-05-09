import React from "react";
import styled from "styled-components";

export const Label = ({children}) => {
    return <LabelStr>{children}</LabelStr>;
};

const LabelStr = styled.div`
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 14px;
    .refresh-icon {
        cursor: pointer;
        margin-left: 5px;
    }
`;
