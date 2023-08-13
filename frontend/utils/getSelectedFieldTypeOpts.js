export const getSelectedFieldTypeOpts = ({updateType, airtableFields = []}) => {
    const image = ["multipleAttachments"];
    const url = [
        "date",
        "select",
        "number",
        "phone",
        "formula",
        "rating",
        "barcode",
        "currency",
        "percent",
        "checkbox",
        "duration",
        "createdBy",
        "multiSelect",
        "phoneNumber",
        "Collaborator",
        "collaborator",
        "singleSelect",
        "lastModifiedBy",
        "multipleSelects",
        "multiCollaborator",
        "externalSyncSource",
        "multipleRecordLinks",
        "singleCollaborator",
        "multipleAttachments",
        "multipleLookupValues",
        "multipleCollaborators",
    ];

    return airtableFields.filter((field) => {
        if (updateType === "image") {
            return image.includes(field.type);
        }
        return !url.includes(field.type);
    });
};
