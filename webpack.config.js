const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",

    entry: {
        main: "./src/assets/SpelunkyClassicHD.js"
    },

    output: {
        path: path.resolve(__dirname, "www"),
        filename: "assets/SpelunkyClassicHD.js"
    },

    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/", to: "./" },
            ]
        }),
    ],

    optimization: {
        splitChunks: {
            chunks: "all",
            name: "dependencies"
        }
    }
}

