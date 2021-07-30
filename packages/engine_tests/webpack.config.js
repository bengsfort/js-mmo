const path = require('path');
const {makeWebpackConfig} = require('@js-mmo/webpack-config-internal');
const CopyPlugin = require("copy-webpack-plugin");

const entry = {
  drawable_test: './src/drawable_test/drawable_test.ts',
  transform_test: './src/transform_test/transform_test.ts',
  input_test: './src/input_test/input_test.ts',
  tileset_test: './src/tileset_test/tileset_test.ts',
  tilemap_test: './src/tilemap_test/tilemap_test.ts',
  text_test: './src/text_test/text_test.ts',
};
const output = {
  path: path.resolve(__dirname, 'build'),
  filename: '[name].js',
};

const config = makeWebpackConfig(entry, output, 'development', 3000, "src/test_template.html");

config.plugins.push(
  new CopyPlugin({
    patterns: [
      { from: "src/drawable_test/assets", to: "assets" },
      { from: "src/tileset_test/assets", to: "assets" },
      { from: "src/tilemap_test/assets", to: "assets" },
      { from: "src/text_test/assets", to: "assets" },
    ]
  })
)

module.exports = config;