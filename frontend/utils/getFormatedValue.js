export const getFormatedValue = (record, str = []) => {
    return str.map((item) => {
        const [fieldKey, nestedPath] = item.value || [];
        let value = "";
        if (fieldKey) {
            value = record.getCellValue(fieldKey);
        }
        if (nestedPath) {
            let src = nestedPath
                .split("/")
                .reduce((acc, curr) => acc[curr], value[0]);

            value = src;
        }
        return {
            ...item,
            value,
        };
    });
};
