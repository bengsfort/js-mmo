const path = require('path');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  context: process.cwd(),
  entry: {
    // This will likely have to change in the future! Testing purposes only!
    main: ['./src/index.ts']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [
    // new ForkTsCheckerWebpackPlugin({
    //   eslint: true,
    // }),
    // new ForkTsCheckerNotifierWebpackPlugin({
    //   title: 'TypeScript',
    //   excludeWarnings: false,
    // }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/test_template.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /.ts$/,
        use: [
          { loader: 'ts-loader', options: { transpileOnly: true } }
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