const isStringValue = (field) => {
    return ["singleLineText", "number", "multilineText"].includes(field.type);
};

export const getAirtableFieldOpts = (fields, type, record) => {
    if (!type) return [];
    switch (type) {
        case "src": {
            let attachmentFields = fields.filter(
                (field) => field.type === "multipleAttachments"
            );

            attachmentFields = attachmentFields.map((field) => {
                let value = record.getCellValue(field.value);
                let opts = [];

                if (value && value[0]) {
                    opts = [
                        {
                            label: "Main Image",
                            type: field.type,
                            value: value[0].url,
                        },
                    ].concat(
                        Object.entries(value[0].thumbnails).map(
                            ([key, val]) => ({
                                label: `Thumbnails ${key}`,
                                value: val.url,
                                type: field.type,
                            })
                        )
                    );
                }

                return {...field, children: opts};
            });

            return attachmentFields;
        }

        default:
            return fields.filter(isStringValue);
    }
};
