export const generatePayload = (arr = [], template = "") => {
    let modifications = arr.map(({path = [], value}) => {
        const [name, type] = path.split(".");
        return {
            name,
            [type]: value,
        };
    });

    return {template, modifications};
};
