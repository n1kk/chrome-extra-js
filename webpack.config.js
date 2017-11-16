const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outDir = path.resolve(__dirname, "dist/")

module.exports = {
  devtool: "source-map",
  entry: {
    "content-script": "./src/content-script.js",
    "background": "./src/background.js",
    "popup": "./src/popup.js",
  },
  output: {
    publicPath: ".",
    path: outDir,
    filename: "[name].js",
    libraryTarget: "umd"
  },
  plugins: [
    //We check the NODE_ENV for the "development" value to include the plugin
    //process.env.NODE_ENV === "development"? new ChromeExtensionReloader() : null,
    new ChromeExtensionReloader(),
    new CleanWebpackPlugin([outDir], { verbose: true, dry: false }),
    new ExtractTextPlugin({ filename: "style.css" }),
    new CopyWebpackPlugin([{ from: "./assets/", to: path.resolve(outDir, "assets/") , flatten: true }]),
    new CopyWebpackPlugin([{ from: "./src/manifest.json", to: outDir, flatten: true }]),
    new CopyWebpackPlugin([{ from: "./src/popup.html", to: outDir, flatten: true }]),
    /*new HtmlWebpackPlugin({
      hash: false,
      filename: './popup.html',
      template: './src/popup.html',
      inject: 'body',
      chunksSortMode: 'dependency',
    }),*/
  ].filter(plugin => !!plugin),
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [require("babel-preset-es2015")]
        }
      }
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader",
      }),
    }]
  }
};