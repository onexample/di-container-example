module.exports = {
    "verbose": true,
    "moduleFileExtensions": [
        "ts",
        "js"
    ],
    "coverageReporters": [
        "json-summary",
        "json",
        "lcov"
    ],
    "collectCoverage": true,
    "transform": {
        ".(ts|tsx)": "ts-jest"
    },
    "testPathIgnorePatterns": [
        "\\.snap$",
        "<rootDir>/node_modules/"
    ]

}