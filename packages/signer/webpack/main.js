const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./common');

module.exports = merge(common, {
  entry: { index: './src/main.ts', worker: './src/crypto/crypto.worker.ts' },
  target: 'electron-main',
  module: {
    rules: [
      // Overrides the configuration for the crypto worker to make the build include less dependencies
      {
        test: /crypto\.worker\.ts$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              '@babel/preset-typescript',
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current'
                  },
                  modules: false
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        path.resolve(__dirname, '../', 'src', 'app', 'assets', 'images', 'favicon.png'),
        path.resolve(__dirname, '../', 'src', 'app', 'assets', 'images', 'icon.png')
      ]
    })
  ],
  resolve: {
    alias: {
      '@ethersproject/random': require.resolve('@ethersproject/random/lib/index.js'),
      '@ethersproject/wordlists': require.resolve(
        '@ethersproject/wordlists/lib.esm/browser-wordlists.js'
      )
    }
  },
  output: {
    filename: '[name].js'
  }
});
