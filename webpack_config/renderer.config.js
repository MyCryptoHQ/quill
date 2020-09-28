const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const plugins = require('./plugins');
const rules = require('./rules');

// @todo: use webpack merge
rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
});

module.exports = {
  module: {
    rules
  },
  plugins,
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json')
      })
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  }
};
