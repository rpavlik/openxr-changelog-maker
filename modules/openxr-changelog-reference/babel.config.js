module.exports = {
    exclude: ['node_modules/@babel/**'],
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