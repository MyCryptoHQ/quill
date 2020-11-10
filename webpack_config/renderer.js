const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./common');

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
      metaCsp:
        process.env.NODE_ENV === 'development'
          ? ''
          : `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';`
    })
  ],

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.jsx', '.tsx', '.css']
  }
});
