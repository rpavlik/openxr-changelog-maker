module.exports = {
    exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: "3.9.1"
            },
        ],
        '@babel/preset-typescript'
    ],
}