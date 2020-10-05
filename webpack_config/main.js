const CopyWebpackPlugin = require('copy-webpack-plugin');
const LavaMoatPlugin = require('lavamoat-webpack');
const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./common');

module.exports = merge(common, {
  entry: './src/main.ts',
  optimization: {
    concatenateModules: false
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        path.resolve(__dirname, '../', 'src', 'app', 'assets', 'images', 'favicon.png'),
        path.resolve(__dirname, '../', 'src', 'app', 'assets', 'images', 'icon.png')
      ]
    }),
    new LavaMoatPlugin({
      config: '../lavamoat/lavamoat-config.main.json',
      configOverride: '../lavamoat/lavamoat-config.main.json'
    })
  ]
});
