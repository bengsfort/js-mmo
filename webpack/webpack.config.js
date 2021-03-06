const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DEFAULT_OUTPUT = {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
};

const makeWebpackConfig = (entry, output = DEFAULT_OUTPUT, mode = 'development', devPort = 3000, templateName = "src/template.html") => ({
  mode,
  context: process.cwd(),
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry,
  output,
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: templateName,
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
              configFile: "tsconfig.json"
            }
          }
        ]
      },
      {
        test: /\.(png|svg)$/i,
        type: 'asset/resource',
      }
    ]
  },
  optimization: {
    usedExports: true,
  },
  devtool: 'eval',
  devServer: {
    port: devPort,
  },
});

module.exports = {
    makeWebpackConfig,
};