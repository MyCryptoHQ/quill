const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { v4 } = require('uuid');
const { merge } = require('webpack-merge');

const common = require('./common');

const isDev = process.env.NODE_ENV !== 'production';

// Generate a new base64 nonce
const nonce = Buffer.from(v4()).toString('base64');

module.exports = merge(common, {
  // The `electron-renderer` target assumes that the renderer process has access to Node.js APIs,
  // which is unsafe. Instead we have to use the "web" plugin, and do any necessary configuration
  // for Electron manually.
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },

      /**
       * Fonts
       */
      {
        test: /\.woff2?/,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              loader: 'file-loader',
              outputPath: 'main_window',
              publicPath: (url) => (isDev ? `main_window/${url}` : url)
            }
          }
        ]
      },

      /**
       * Images
       */
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: 'src/app/assets/[name].[contenthash].[ext]',
              outputPath: 'main_window',
              publicPath: (url) => (isDev ? `main_window/${url}` : url)
            }
          }
        ],
        include: [path.resolve(__dirname, '../', 'src', 'app', 'assets')]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/app/index.html'),
      inject: false,
      isProduction: !isDev,
      nonce // option to expose the nonce to the template
    }),
    new CspHtmlWebpackPlugin({
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
      'script-src': ["'self'"],
      'style-src': isDev ? ["'unsafe-inline'"] : ["'self'", `'nonce-${nonce}'`],
      'frame-src': ["'none'"],
      'worker-src': ["'none'"]
    })
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.jsx', '.tsx', '.css'],
    mainFields: ['browser', 'module', 'main']
  },
  node: {
    fs: 'empty'
  }
});
