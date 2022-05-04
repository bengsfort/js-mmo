const path = require('path');
const { makeWebpackConfig } = require('@js-mmo/webpack-config-internal');

const entry = {
  index: './src/index.ts',
};
const output = {
  path: path.resolve(__dirname, 'build'),
  filename: '[name].js',
};

const config = makeWebpackConfig(entry, output, 'development', 3000, "src/index.html");

module.exports = config;
