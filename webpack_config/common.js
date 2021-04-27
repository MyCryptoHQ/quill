const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  module: {
    rules: [
      // Add support for native node modules
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack|crypto\.worker\.ts)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '@fixtures': path.join(__dirname, '../jest_config/__fixtures__')
    },
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json')
      })
    ]
  },

  plugins: [new ForkTsCheckerWebpackPlugin()]
};
