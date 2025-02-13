module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'airbnb-base'
    ],
    plugins: ['import'],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false
    },
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx']
            }
        }
    },
    rules: {
        'import/no-extraneous-dependencies': 'off',
        'import/prefer-default-export': 'off',
        'no-param-reassign': ['error', { props: false }],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'max-len': ['error', { code: 120 }]
    }
};
