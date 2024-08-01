// jest.config.js
module.exports = {
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js"
    },
    setupFiles: ['<rootDir>/jest.setup.js'],

    moduleFileExtensions: [
        "js",
        "jsx",
        "json",
        "vue",
        "css",
        "scss"
    ],
};
