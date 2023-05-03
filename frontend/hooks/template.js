import React from "react";
import {useState} from "react";

function useGetTemplates() {
    const [templates, setTemplates] = useState([]);
    fetch("https://imgfly.dorik.dev/api/v1/templates").then((res) =>
        setTemplates(res.json())
    );
    return <div>useGetTemplates</div>;
}

export default useGetTemplates;
