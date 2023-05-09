import {Label} from "./Label";
import styled from "styled-components";
import {Button, Input} from "antd";
import {AirtableContext} from "../context/AirtableContext";
import {EditOutlined, SaveFilled} from "@ant-design/icons";
import React, {useContext, useEffect, useState} from "react";

function APIKey() {
    const {apiKey, handleUpdateState} = useContext(AirtableContext);
    const [state, setState] = useState({});

    const handleChange = ({target}) => {
        setState((prev) => ({...prev, apiKey: target.value}));
    };
    const handleEdit = () => {
        setState((prev) => ({...prev, disabled: false}));
    };
    const handleSave = () => {
        // set an API call
        handleUpdateState({apiKey: state.apiKey});
        setState((prev) => ({...prev, disabled: true}));
    };

    useEffect(() => {
        apiKey && setState({apiKey: apiKey, disabled: true});
    }, [apiKey]);

    return (
        <React.Fragment>
            <Label>API Key</Label>
            <Wrapper>
                <Input
                    disabled={state.disabled}
                    value={state.apiKey}
                    onChange={handleChange}
                    onPressEnter={handleSave}
                />
                {state.disabled ? (
                    <Button icon={<EditOutlined />} onClick={handleEdit}>
                        Edit
                    </Button>
                ) : (
                    <Button icon={<SaveFilled />} onClick={handleSave}>
                        Save
                    </Button>
                )}
            </Wrapper>
        </React.Fragment>
    );
}

const Wrapper = styled.div`
    gap: 5px;
    display: flex;
    margin-bottom: 10px;
`;

export default APIKey;
