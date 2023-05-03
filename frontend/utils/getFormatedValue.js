export const getFormatedValue = (record, str = []) => {
    return str.map((item) => {
        const [fieldKey, src] = item.value || [];
        let value = "";
        if (fieldKey) {
            value = record.getCellValue(fieldKey);
        }
        if (src) {
            value = src;
        }
        return {
            ...item,
            value,
        };
    });
};
