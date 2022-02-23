const path = require("path");
module.exports = {
    mode: "production",
    target: "node",
    entry: path.resolve(`${"src"}/extension/rn-extension.ts`),
    output: {
        path: path.resolve("dist"),
        filename: "rn-extension.js",
        devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    devtool: false,
    resolve: {
        extensions: [".js", ".ts", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        // vscode-nls-dev loader:
                        // * rewrite nls-calls
                        loader: "vscode-nls-dev/lib/webpack-loader",
                        options: {
                            base: path.join(__dirname),
                        },
                    },
                    {
                        // configure TypeScript loader:
                        // * enable sources maps for end-to-end source maps
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                sourceMap: true,
                            },
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            // new TerserPlugin({
            //     terserOptions: {
            //         format: {
            //             comments: /^\**!|@preserve/i,
            //         },
            //     },
            //     extractComments: false,
            // }),
        ],
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: {
        vscode: "commonjs vscode",
    },
};
