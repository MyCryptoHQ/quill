const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const rules = require('./rules');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
