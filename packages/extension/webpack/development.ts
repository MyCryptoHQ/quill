import merge from 'webpack-merge';

import common from './common';

const config = merge(common, {
  mode: 'development',
  devtool: 'source-map'
});

export default config;
