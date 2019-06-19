// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

//@ts-check

'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  mode: 'development',
  entry: {
    'reactNativeDebugEntryPoint': './src/debugger/reactNativeDebugEntryPoint.ts'
  },
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    // xdl: 'commonjs xdl',
    // ws: 'commonjs ws',
    'vscode-extension-telemetry': 'commonjs vscode-extension-telemetry',
    // 'vscode-nls': 'commonjs vscode-nls',
    // 'flatten-source-map': 'commonjs flatten-source-map',
    // 'vscode-debugadapter': 'commonjs vscode-debugadapter',
    // 'vscode-debugprotocol': 'commonjs vscode-debugprotocol',
    // 'vscode-chrome-debug-core': 'commonjs vscode-chrome-debug-core'
  },
  resolve: {
    // mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'] // support ts-files and js-files
  },
  node: {
    __dirname: false
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [{
        // vscode-nls-dev loader:
        // * rewrite nls-calls
        loader: 'vscode-nls-dev/lib/webpack-loader',
        options: {
          base: path.join(__dirname, 'src')
        }
      }, {
        // configure TypeScript loader:
        // * enable sources maps for end-to-end source maps
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            "sourceMap": true,
          }
        }
      }]
    }]
  }
};
module.exports = config;