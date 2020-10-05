const LavaMoatPlugin = require('lavamoat-webpack');
const { merge } = require('webpack-merge');

const common = require('./common');

module.exports = merge(common, {
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
  },

  /**
   * Configuration for Lavamoat: We remove the concatenateModules optimisation and let LavaMoatPlugin
   * generate our confg.
   */
  optimization: {
    concatenateModules: false
  },
  plugins: [
    new LavaMoatPlugin({
      config: '../lavamoat/lavamoat-config.renderer.json',
      configOverride: '../lavamoat/lavamoat-config.renderer.json'
    })
  ]
});
