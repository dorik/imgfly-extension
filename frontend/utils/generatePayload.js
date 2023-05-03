export const generatePayload = (arr) => {
    return arr
        .map(({path = [], value}) => {
            const [name, type] = path.split(".");
            if (value) {
                return `${name}[${type}]=${encodeURIComponent(value)}`;
            }
        })
        .filter((v) => v)
        .join("&");
};
