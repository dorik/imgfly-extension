function useLocalStorage(defaultKey) {
    const setItem = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };
    const getItem = (key = defaultKey) => {
        return JSON.parse(localStorage.getItem(key), null);
    };

    return {setItem, getItem, data: getItem()};
}

export default useLocalStorage;
