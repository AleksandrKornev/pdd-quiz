const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  entry: __dirname + "/src/js",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "app.js"
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
				test: /\.(jpg|jpeg|png|gif|mp3|svg|ttf|woff2|woff|eot)$/,
				use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
				}
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "html-loader"
          },
          {
            loader: "markdown-loader",
            options: {
              pedantic: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: __dirname + "/src/index.html",
    }),
    /* new webpack.ProvidePlugin({
      $: "jquery/jquery.js",
      jQuery: "jquery/jquery.js",
      "window.jQuery": "jquery/jquery.js"
    }), */
    new CopyWebpackPlugin([
      { from: 'src/css', to: 'css' }
    ])
  ]
}