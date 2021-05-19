const path = require('path');
const {makeWebpackConfig} = require('@js-mmo/webpack-config-internal');

const entry = {
  transform: './engine_tests/transform_test/transform_test.ts',
  input: './engine_tests/input_test/input_test.ts',
};
const output = {
  path: path.resolve(__dirname, 'build'),
  filename: '[name].js',
};

module.exports = makeWebpackConfig(entry, output, 'development', 3000);