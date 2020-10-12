const { merge } = require('webpack-merge');

const common = require('./common');

module.exports = merge(common, {
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  },

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.jsx', '.tsx', '.css']
  }
});
