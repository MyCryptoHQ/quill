const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./common');

module.exports = merge(common, {
  entry: { index: './src/main.ts', worker: './src/crypto/crypto.worker.ts' },
  target: 'electron-main',
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
      '@ethersproject/random': require.resolve('@ethersproject/random/lib/index.js')
    }
  },
  output: {
    filename: '[name].js'
  }
});
