import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import type { Configuration } from 'webpack';
import WebpackBarPlugin from 'webpackbar';

const config: Configuration = {
  entry: {
    'lib/popup': './src/popup.ts',
    'lib/content': './src/content.ts',
    'lib/page': './src/page.ts',

    // Note: the service worker must be at the extension root for it to work
    background: './src/background.ts'
  },
  output: {
    path: resolve(__dirname, '../'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.ts'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      util: false
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new WebpackBarPlugin({}),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../src/index.html'),
      chunks: ['lib/popup'],
      filename: resolve(__dirname, '../lib/popup.html')
    })
  ],
  stats: 'errors-only'
};

export default config;
