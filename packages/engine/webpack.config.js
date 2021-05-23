const path = require('path');
const {makeWebpackConfig} = require('@js-mmo/webpack-config-internal');
const CopyPlugin = require("copy-webpack-plugin");

const entry = {
  drawables: './engine_tests/drawable_tests/drawable_tests.ts',
  transform: './engine_tests/transform_test/transform_test.ts',
  input: './engine_tests/input_test/input_test.ts',
  tilesets: './engine_tests/tileset_test/tileset_test.ts',
};
const output = {
  path: path.resolve(__dirname, 'build'),
  filename: '[name].js',
};

const config = makeWebpackConfig(entry, output, 'development', 3000);

config.plugins.push(
  new CopyPlugin({
    patterns: [
      { from: "engine_tests/tileset_test/assets", to: "assets" },
    ]
  })
)

module.exports = config;