const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { v4 } = require('uuid');
const { merge } = require('webpack-merge');

const common = require('./common');

// Generate a new base64 nonce
const nonce = Buffer.from(v4()).toString('base64');

module.exports = merge(common, {
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        include: [path.join(__dirname, '../node_modules/typeface-lato')]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/app/index.html'),
      inject: false,
      nonce: nonce // option to expose the nonce to the template
    }),
    new CspHtmlWebpackPlugin({
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
      'script-src': ["'self'"],
      'style-src':
        process.env.NODE_ENV === 'development'
          ? ["'unsafe-inline'"]
          : ["'self'", `'nonce-${nonce}'`],
      'frame-src': ["'none'"],
      'worker-src': ["'none'"]
    })
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.jsx', '.tsx', '.css']
  }
});
