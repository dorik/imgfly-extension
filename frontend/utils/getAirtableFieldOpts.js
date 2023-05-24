const isStringValue = (field) => {
    return ["singleLineText", "number", "multilineText"].includes(field.type);
};

export const getAirtableFieldOpts = (fields, type, record) => {
    if (!type) return [];
    switch (type) {
        case "image": {
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
                            value: "url",
                        },
                    ];
                    if (value[0].thumbnails) {
                        Object.entries(value[0].thumbnails).forEach(([key]) => {
                            opts.push({
                                label: `Thumbnails ${key}`,
                                value: `thumbnails/${key}/url`,
                                type: field.type,
                            });
                        });
                    }
                }

                return {...field, children: opts};
            });

            return attachmentFields;
        }

        default:
            return fields.filter(isStringValue);
    }
};
