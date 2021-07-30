const path = require('path');
const {makeWebpackConfig} = require('@js-mmo/webpack-config-internal');
const CopyPlugin = require("copy-webpack-plugin");

// @todo: I'm not sure that this is needed; we may have to just start building out the actual server already.
const entry = {
  gameplay: './src/gameplay.ts',
};
const output = {
  path: path.resolve(__dirname, 'build'),
  filename: '[name].js',
};

// @todo: TEMPORARY
const config = makeWebpackConfig(entry, output, 'development', 3000, "src/template.html");

config.plugins.push(
  new CopyPlugin({
    patterns: [
      { from: "src/assets", to: "assets" },
    ]
  })
)

module.exports = config;