module.exports = {
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js"
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
        '/node_modules/(?!(axios)/)', // Add any other packages that need to be transformed
    ],
    moduleFileExtensions: [
        "js",
        "jsx",
        "json",
        "css",
        "scss"
    ],
};
