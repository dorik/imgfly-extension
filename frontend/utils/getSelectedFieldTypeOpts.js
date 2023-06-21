export const getSelectedFieldTypeOpts = ({updateType, airtableFields = []}) => {
    const image = ["multipleAttachments"];
    const url = [
        "date",
        "barcode",
        "checkbox",
        "createdBy",
        "Collaborator",
        "lastModifiedBy",
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
