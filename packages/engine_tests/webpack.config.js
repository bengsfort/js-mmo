const path = require('path');
const {makeWebpackConfig} = require('@js-mmo/webpack-config-internal');
const CopyPlugin = require("copy-webpack-plugin");

const entry = {
  drawables: './src/drawable_tests/drawable_tests.ts',
  transform: './src/transform_test/transform_test.ts',
  input: './src/input_test/input_test.ts',
  tilesets: './src/tileset_test/tileset_test.ts',
  tilemaps: './src/tilemap_test/tilemap_test.ts',
};
const output = {
  path: path.resolve(__dirname, 'build'),
  filename: '[name].js',
};

const config = makeWebpackConfig(entry, output, 'development', 3000);

config.plugins.push(
  new CopyPlugin({
    patterns: [
      { from: "src/tileset_test/assets", to: "assets" },
      { from: "src/tilemap_test/assets", to: "assets" },
    ]
  })
)

module.exports = config;