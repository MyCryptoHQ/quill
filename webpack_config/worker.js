const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./common');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    worker: './src/crypto/crypto.worker.ts'
  },
  target: 'node',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../.worker')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              '@babel/preset-typescript',
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current'
                  },
                  modules: false
                }
              ]
            ]
          }
        }
      }
    ]
  }
});
