const path = require('path');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  context: process.cwd(),
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: {
    // This will likely have to change in the future! Testing purposes only!
    drawables: './engine_tests/drawables_test/drawables_test.ts',
    input: './engine_tests/input_test/input_test.ts',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'engine_tests/test_template.html',
      title: '@js-mmo/game',
    }),
  ],
  module: {
    rules: [
      {
        test: /.ts$/,
        use: [
          {
            loader: 'ts-loader', options: {
              transpileOnly: true,
              configFile: "tsconfig.tests.json"
            }
          }
        ]
      },
    ]
  },
  optimization: {
    usedExports: true,
  },
  devtool: 'eval',
  devServer: {
    port: 3000,
  },
};