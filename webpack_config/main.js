const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./common');

module.exports = merge(common, {
  entry: './src/main.ts',
  target: 'electron-main',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        path.resolve(__dirname, '../', 'src', 'app', 'assets', 'images', 'favicon.png'),
        path.resolve(__dirname, '../', 'src', 'app', 'assets', 'images', 'icon.png')
      ]
    })
  ]
});
