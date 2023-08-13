module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: "module",
    },
    plugins: ["react", "react-hooks"],
    rules: {
        "no-unused-vars": "warn",
        "react/prop-types": "off",
        "no-prototype-builtins": "off",
        "react/display-name": "off",
        "no-inner-declarations": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
