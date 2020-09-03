const path = require('path');
const rules = require('./rules');
const plugins = require('./plugins');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
