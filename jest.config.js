module.exports = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    roots: ["<rootDir>/src"],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
