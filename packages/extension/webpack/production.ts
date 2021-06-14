import merge from 'webpack-merge';

import common from './common';

const config = merge(common, {
  mode: 'production',
  devtool: 'source-map'
});

export default config;
